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

app.post('/scenario', (req, res) => {
	console.log('in post, with body ' + JSON.stringify(req.body));

	MongoClient.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("HummusDB");
		dbo.collection("scenario").findOne({}, function(err, result) {
		  if (err) throw err;
		  res.json([
			result
		]);
		  db.close();
		});
	  });



});

app.listen(port, () => console.log('server started on port ' + port));