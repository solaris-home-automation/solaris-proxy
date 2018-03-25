var http = require('http');
var express = require('express');
var i2c = require('i2c-bus');

var app = express();

var inputs = [{ pin: '11', gpio: '17', value: 1 },
              { pin: '12', gpio: '18', value: 0 }];


// Express route for incoming requests for a customer name
app.get('/things', function(req, res) {

    async.series([
      function (cb) {
        i2c1 = i2c.open(1, cb);
        console.log('I2C opened');
      },
      function (cb) {
        // scan for devices
        i2c1.scan(function (err, addresses) {
          if (err) return cb(err);
          console.log('Addresses found: '+addresses);
          res.status(200).send(addresses);
        });
      },
      function (cb) {
        i2c1.close(cb);
        console.log('I2C closed');
      }
    ], function (err) {
      console.log('Error ' + err);
      if (err) throw err;
    });

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
