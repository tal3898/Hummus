const express = require('express');

const app = express();

const port = 5000;

app.post('/scenario', (req,res) => {
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