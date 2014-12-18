var express = require('express');
var path = require('path');

var HttpServer = function(imageManager){
	var router = express();

	this.listen = function(){
		init();
		router.listen(1337);	
		console.log("Server listening at 1337..");
	};

	var init = function(){
		router.use(function (req, res, next) {
		    res.set('Access-Control-Allow-Origin', '*');
		    next();
		});

		// Serve domain list
		router.get('/list/domain/', function (req, res) {    
			imageManager.listDomains(function(list){
				res.json(list);
			});
		});

		// Serve year list for given domain
		router.get('/list/:domain/year/', function (req, res) {
		    imageManager.listYears(req.params.domain, function(list){
				res.json(list);
			});
		});

		// Serve event list for given year
		router.get('/list/:domain/:year/event/', function (req, res) {
		    imageManager.listYearEvents(req.params.domain, req.params.year, function(list){
				res.json(list);
			});
		});

		// Serve event list for given domain
		router.get('/list/:domain/event/', function (req, res) {
		    imageManager.listEvents(req.params.domain, function(list){
				res.json(list);
			});
		});

		// Serve image list from given event
		router.get('/list/:domain/:year/:event/image/', function (req, res) {
			imageManager.listImages(req.params.domain, 
									req.params.year, 
									req.params.event,
				function(list){
					res.json(list);
				}
			);
		});

		// Serve thumbnails
		router.get('/thumb/:domain/:year/:event/:image', function (req, res) {
		    console.log("Serving image");
		    var p = path.join(path.resolve("."), 'cache', 'thumb', req.params.domain, req.params.year, req.params.event, req.params.image);
		    res.sendFile(p, '', function (err){ handleSendFileError(err, res, p); });
		});

		// Serve image
		router.get('/image/:domain/:year/:event/:image', function (req, res) {

		    var p = path.join(path.resolve("."), 'cache', 'large', req.params.domain, req.params.year, req.params.event, req.params.image);
		    res.sendFile(p, '', function (err){ handleSendFileError(err, res, p); });
		});

		var handleSendFileError = function(err, res, p){
		    if (err) {
		        if (err.code === "ECONNABORT" && res.statusCode == 304) {
		            // No problem, 304 means client cache hit, so no data sent.
		            console.log('304 cache hit for ' + p);
		            return;
		        }
		        console.error("SendFile error:", err, " (status: " + err.status + ")");
		        if (err.status) {
		            res.status(err.status).end();
		        }
		    }
		    else {
		        console.log('Sent:', p);
		    }
		};

		router.get('/', function (req, res) {
		    res.set('Content-Type', 'text/plain');
		    res.status(200);
		    res.send('Hello World')
		});
	};
};

module.exports = HttpServer;