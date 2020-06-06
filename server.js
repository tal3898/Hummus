const express = require('express');
const mongo = require('mongodb');
var bodyParser = require('body-parser')
var request = require('request');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

console.log("PORT: " + process.env.PORT);

var MongoClient = mongo.MongoClient;
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

var NgUrl = process.env.NG_URL;

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

const port = 5000;

app.get('/folder', async (req, res) => {

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db(dbName);
	var result = await dbo.collection("scenario").findOne({}, { _id: 0 });

	console.log('restult is ' + JSON.stringify(result))
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
	console.log('sneding to ' + NgUrl)
	for (var index in requestsList) {
		var requestData = requestsList[index];
		var body = '';

		if (requestData.method == 'POST') {
			body = await request.post(NgUrl + '/' + requestData.entity, {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData.data)
			});
		} else if (requestData.method == 'PUT') {
			body = await request.put(NgUrl + '/' + requestData.entity, {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData.data)
			});
		} else if (requestData.method == 'DELETE') {
			body = await request.delete(NgUrl + '/' + requestData.entity, {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData.data)
			});
		}

	//	await sleep(1000);


	}

	res.json({ 'message': 'Sent to NG'})
})

function sleep(ms) {
	return new Promis ((resolve) => {
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