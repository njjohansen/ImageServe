var express = require('express');
var path = require('path');

var HttpServer = function(){
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
		    res.json(["domain1", "domain2"]);
		});

		// Serve year list for given domain
		router.get('/list/:domain/year/', function (req, res) {
		    res.json(["2013", "2014"]);
		});

		// Serve event list for given domain
		router.get('/list/:domain/event/', function (req, res) {
		    res.json([
		        {
		            id: "event1", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }},
		        {
		            id: "event2", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }},
		        {
		            id: "event3", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }},
		        {
		            id: "event4", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }}
		    ]);
		});

		// Serve event list for given year
		router.get('/list/:domain/:year/event/', function (req, res) {
		    res.json([
		        {
		            id: "event1", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }},
		        {
		            id: "event2", metadata: {
		            "title": "Some important event",
		            "date": "2012-04-23T18:25:43.511Z",
		            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit justo. Integer fermentum non dolor quis porta. Vivamus consectetur mattis elementum. Fusce nec quam sit amet mauris molestie tincidunt at quis quam. Vestibulum porta varius enim, eget tristique dui porttitor id. Fusce nec massa id felis consequat placerat a quis tortor. Proin et condimentum felis, in iaculis eros. Donec et elementum elit. Curabitur sit amet diam euismod dui sagittis sagittis. Sed at pharetra massa. Donec vel efficitur dolor. Nunc et turpis ullamcorper massa aliquam porttitor ut sed metus. Fusce nunc ex, scelerisque eu dui tincidunt, ullamcorper tristique orci. Quisque."
		        }}
		    ]);
		});

		// Serve image list from given event
		router.get('/list/:domain/:year/:event/image/', function (req, res) {
		    res.json([
		        {"imageId": "Tulips.jpg"},
		        {"imageId": "Penguins.jpg"}
		    ]);
		});

		// Serve thumbnails
		router.get('/thumb/:domain/:year/:event/:image', function (req, res) {
		    console.log("Serving image");
		    var p = path.join(path.resolve("."), 'images', req.params.domain, req.params.year, req.params.event, req.params.image);
		    res.sendFile(p, '', function (err){ handleSendFileError(err, res, p); });
		});

		// Serve image
		router.get('/image/:domain/:year/:event/:image', function (req, res) {

		    var p = path.join(path.resolve("."), 'images', req.params.domain, req.params.year, req.params.event, req.params.image);
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