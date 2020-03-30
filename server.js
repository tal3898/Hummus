const express = require('express');

var bodyParser = require('body-parser')


const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const port = 5000;

app.post('/scenario', (req,res) => {
	console.log('in post, with body ' + JSON.stringify(req.body))
	res.json([
		{
			name: 'first',
			files: []
		}, {
			name: 'second',
			files: []
		}, {
			name: 'third',
			steps: []
		}
	]);
});

app.listen(port, ()=> console.log('server started on port ' + port) );