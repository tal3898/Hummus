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

app.post('/scenario', async (req, res) => {
	console.log('in post, with body ' + JSON.stringify(req.body));

	var db = await MongoClient.connect(dbUrl);
	var dbo = db.db("HummusDB");
	var result = await dbo.collection("scenario").find({path: {$regex: '^' + req.body.path + '/' } }, {path:1,_id:0, steps:[]}).toArray();
	
	// Take only the documents which are direct children of the request path
	var currPathChildren = result.filter((document) => document.path.split('/').length == req.body.path.split('/').length + 1 );

	console.log('restult is ' + JSON.stringify(result))
	res.json(currPathChildren);

	db.close();
});

app.listen(port, () => console.log('server started on port ' + port));