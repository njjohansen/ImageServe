process.on('uncaughtException', function (error) {
   console.log(error.stack);
});


var fs = require('fs');
var http = require('http');
var watch = require('node-watch');

var imageManager = require('./ImageManager');
var HttpServer = require('./HttpServer');
var httpServer = new HttpServer(imageManager);

// process image source library
imageManager.process();
setInterval(imageManager.process, 60000);
// start httpServer
httpServer.listen();

