const express = require('express');
const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const dbUrl = "mongodb://localhost:27017/";

var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

const port = 5000;

app.get('/folder', async (req, res) => {

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");
	var result = await dbo.collection("scenario").findOne({}, {_id:0});
	
	console.log('restult is ' + JSON.stringify(result))
	res.json(result);

	db.close();
});

app.post('/folder', async (req, res) => {

	var scenarioDocument = req.body;
	
	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");
	
	// Insert the folder to the folder hirechical
	var pathWithDots = req.body.path.replace('/','').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = {} ;

	await dbo.collection("scenario").update({}, {'$set': updateQuery });

	res.json({response: 'saved in db'});

	db.close();
});



app.post('/scenario', async (req, res) => {

	var scenarioDocument = req.body;
	
	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");
	
	// Insert the actual scenario
	await dbo.collection("scenarioFiles").insertOne(scenarioDocument);

	// Insert the scenario to the folder hirechical
	var pathWithDots = req.body.path.replace('/','').split('/').join('.');
	var updateQuery = {};
	updateQuery[pathWithDots] = 'file' ;

	await dbo.collection("scenario").update({}, {'$set': updateQuery });
	

	res.json({response: 'saved in db'});

	db.close();
});

app.post('/scenarioFile', async (req, res) => {

	var wantedScenarioPath = req.body.path;
	
	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");


	var result = await dbo.collection("scenarioFiles").findOne({path: wantedScenarioPath}, {_id:0});
	
	

	res.json(result);

	db.close();
});


app.listen(port, () => console.log('server started on port ' + port));