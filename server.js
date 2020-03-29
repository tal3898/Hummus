const express = require('express');

const app = express();

const port = 5000;

app.get('/numbers', (req,res) => {
	res.json([1,1,2,3,5,8,13]);
});

app.listen(port, ()=> console.log('server started on port ' + port) );