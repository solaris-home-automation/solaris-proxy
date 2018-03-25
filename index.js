var http = require('http');
var express = require('express');
var i2c = require('i2c-bus');

var app = express();

var inputs = [{ pin: '11', gpio: '17', value: 1 },
              { pin: '12', gpio: '18', value: 0 }];


// Express route for incoming requests for a customer name
app.get('/things', function(req, res) {
  i2c1 = i2c.openSync(1);
  var addresses = i2c1.scanSync();
  res.status(200).send(addresses);
});

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});

app.listen(3000);
console.log('App Server running at port 3000');
