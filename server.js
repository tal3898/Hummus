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
	var result = await dbo.collection("scenario").find({}).toArray();
	
	console.log('restult is ' + JSON.stringify(result))
	res.json(
		result
	);
	db.close();
});

app.listen(port, () => console.log('server started on port ' + port));