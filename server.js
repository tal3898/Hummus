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

app.get('/scenario', async (req, res) => {

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");
	var result = await dbo.collection("scenario").findOne({}, {_id:0});
	
	console.log('restult is ' + JSON.stringify(result))
	res.json(result);

	db.close();
});

app.listen(port, () => console.log('server started on port ' + port));