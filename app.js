'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var path = require('path');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use(express.static('api-docs'));

app.get('/swagger.yaml', function(req, res) {
  res.setHeader('Content-Type', 'text/x-yaml');
  res.sendFile(path.join(__dirname, "./api/swagger/swagger.yaml"));
});

app.get('/api', function(req, res) {
  res.sendFile(path.join(__dirname, "./api-docs/index.html"));
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
