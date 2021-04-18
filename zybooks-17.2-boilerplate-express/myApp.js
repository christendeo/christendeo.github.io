var express = require('express');
var bodyParser = require('body-parser');
var app = express();
console.log('Hello World');
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const mySecret = process.env['MESSAGE_STYLE']

app.use(function (req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

app.use('/public', express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/name', function(req, res) {
  var firstName = req.query.first;
  var lastName = req.query.last;
  res.json({ name: `${firstName} ${lastName}`});
});

app.get('/:word/echo', function(req, res) {
  var { word } = req.params;
  res.json({echo: word});
});

app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({time: req.time});
});

app.get('/json', (req, res) => {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    res.json({"message": "HELLO JSON"});
  } else {
    res.json({"message": "Hello json"});
  }
});

app.post('/name', function(req, res) {
  var firstName = req.body.first;
  var lastName = req.body.last;
  var combined = firstName + " " + lastName;
  res.json({ name: combined });
});

































module.exports = app;
