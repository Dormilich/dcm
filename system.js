
var express  = require('express');
var mongoose = require('mongoose');
mongoose.connect('localhost', 'dsa');

var app = express();
app.get('/', function (req, res) {
	res.send('Nothing to do.');
});
var api = require('./controllers/import-talente');
app.get('/load_talente', api.loadInitData);
app.get('/show_talente', api.list);

app.listen(1337);
