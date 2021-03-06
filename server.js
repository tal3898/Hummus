const express = require('express');
const mongo = require('mongodb');
var bodyParser = require('body-parser')
var request = require('request');

const got = require('got');

const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

console.log("PORT: " + process.env.PORT);

var MongoClient = mongo.MongoClient;
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	limit: '5mb',
	extended: true
}));
app.use(morgan(function (tokens, req, res) {
	return JSON.stringify({
		'method': tokens.method(req, res),
		'url': tokens.url(req, res),
		'timestamp': tokens.date(req, res, 'iso'),
		'ip': req.ip,
		'host': req.host,
		'hostname': req.hostname,
		'status': tokens.status(req, res),
		'responseLength': tokens.res(req, res, 'content-length'),
		'responseTime': tokens['response-time'](req, res) + ' ms'
	});


}));


const port = 5000;

app.get('/folder', async (req, res) => {
	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);
	var result = await dbo.collection("scenario").findOne({}, { _id: 0 });

	res.json(result);

	db.close();
});

app.post('/folder', async (req, res) => {

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);

	// Insert the folder to the folder hirechical
	var pathWithDots = req.body.path.replace('/', '').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = {};

	await dbo.collection("scenario").update({}, { '$set': updateQuery });

	res.json({ response: 'saved in db' });

	db.close();
});

app.delete('/folder', async (req, res) => {
	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);

	// Remove the folder from the hierarchy
	var pathWithDots = req.body.path.replace('/', '').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = {};
	await dbo.collection("scenario").update({}, { '$unset': updateQuery });

	// Remove all files under this folder
	var startWithFolderNameRegex = '^' + req.body.path + '/';
	await dbo.collection("scenarioFiles").remove({ path: { '$regex': startWithFolderNameRegex } });

	res.json({ response: 'saved in db' });

	db.close();
});



app.post('/scenario', async (req, res) => {
	var scenarioDocument = req.body;

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);

	// If scenario already exists, remove it.
	var scenarioPath = scenarioDocument.path;
	var result = await dbo.collection("scenarioFiles").findOne({ path: scenarioPath }, { _id: 0 });
	if (result) {
		await dbo.collection("scenarioFiles").remove({ path: scenarioPath });
	}

	// Insert the actual scenario
	await dbo.collection("scenarioFiles").insertOne(scenarioDocument);

	// Insert the scenario to the folder hirechical
	var pathWithDots = req.body.path.replace('/', '').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = 'file';

	await dbo.collection("scenario").update({}, { '$set': updateQuery });

	res.json({ response: 'saved in db' });

	db.close();
});

app.post('/scenarioFile', async (req, res) => {

	var wantedScenarioPath = req.body.path;

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);


	var result = await dbo.collection("scenarioFiles").findOne({ path: wantedScenarioPath }, { _id: 0 });



	res.json(result);

	db.close();
});

app.delete('/scenarioFile', async (req, res) => {

	var wantedScenarioPath = req.body.path;

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);

	// remove from the scenarioFiles collection
	var result = await dbo.collection("scenarioFiles").remove({ path: wantedScenarioPath });

	// remove from the hierarchy
	var pathWithDots = req.body.path.replace('/', '').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = {};

	await dbo.collection("scenario").update({}, { '$unset': updateQuery });

	res.json(result);

	db.close();
});

app.post('/NgRequest', async (req, res) => {

	var requestsList = req.body.entities;
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

	var response = [];
	var allSuccess = true;

	for (var index in requestsList) {
		try {
			var requestData = requestsList[index];
			var body = '';

			console.log('sneding to ' + requestData.ngUrl);
			if (requestData.method == 'POST') {
				body = await got(requestData.ngUrl + '/' + requestData.entity, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestData.data)
				});

			} else if (requestData.method == 'PUT') {
				body = await request.put(requestData.ngUrl + '/' + requestData.entity, {
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestData.data)
				});
			} else if (requestData.method == 'DELETE') {
				body = await request.delete(requestData.ngUrl + '/' + requestData.entity, {
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestData.data)
				});
			}
			console.log('ng response: ' + body);


			response.push({
				message: body.body
			});

			await sleep(1000);

		} catch (e) {
			allSuccess = false;
			var errorObject = {
				message: e.message
			}

			if (e.response != undefined) {
				errorObject.responseBody = JSON.parse(e.response.body);
			}

			response.push(errorObject);
		}

	}

	res.json({
		isSuccess: allSuccess,
		response: response
	})
})

process.on('uncaughtException', function (err) {
	console.log(err);
});

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	})
}

// Allowed files extensions list.
const allowedExt = [
	'.js', '.ico', '.css', '.png', '.jpg',
	'.woff2', '.woff', '.ttf', '.svg',
];

function isFileAllow(reqUrl) {
	return (allowedExt.filter(ext => reqUrl.indexOf(ext) > 0).length > 0);
}

// Redirect angular requests back to client side.
app.get('/*', (req, res) => {

	let buildFolder = 'build/';
	let file = isFileAllow(req.url) ? req.url : 'index.html';
	let filePath = path.resolve(buildFolder + file);

	res.sendFile(filePath);
});

app.listen(port, () => console.log('server started on port ' + port));