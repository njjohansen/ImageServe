var express = require('express');
var path = require('path');
var multiparty = require('multiparty');

var HttpServer = function(imageManager){
	var router = express();

	this.listen = function(){
		init();
		router.listen(1337, function() {
			console.log("Server listening at 1337..");
		});
	};

	var init = function(){
		router.use(function (req, res, next) {
				res.set('Access-Control-Allow-Origin', '*');
				next();
		});

		// Serve domain list
		router.get('/', function(req, res) {
			imageManager.listDomains(function(list) {
				res.json(list);
			});
		});

		// Serve year list for given domain
		router.get('/:domain/years', function (req, res) {
			imageManager.listYears(req.params.domain, function(list){
				res.json(list);
			});
		});

		// Serve event list for given year
		router.get('/:domain/years/:year/events', function (req, res) {
			imageManager.listYearEvents(req.params.domain, req.params.year, function(list) {
				res.json(list);
			});
		});

		// Serve event list for given domain
		router.get('/:domain/events', function(req, res) {
			imageManager.listEvents(req.params.domain, function(list) {
				res.json(list);
			});
		});

		// Serve image list from given event
		router.get('/:domain/years/:year/events/:event/images', function (req, res) {
			imageManager.listImages(req.params.domain, req.params.year, req.params.event, function(list) {
					res.json(list);
				}
			);
		});

		// Serve thumbnails
		router.get('/:domain/years/:year/events/:event/images/:format/:image', function (req, res) {

			console.log("Serving image "+req.params.image+" in "+req.params.format);

			var p = path.join(path.resolve("."), 'cache', req.params.format, req.params.domain, req.params.year, req.params.event, req.params.image);
			res.sendFile(p, '', function (err){ handleSendFileError(err, res, p); });
		});

		// Receive mail from Mailgun
		router.post('/receive_mail', function(req, res) {
			var eventname = req.query.eventname.toLowerCase();

			var form = new multiparty.Form();
 
			
			var metadata = {
				author: '',
				email: '',
				title: ''
			};

			form.on("field", function(name, value) {
				if (name == 'From') {
					var match = value.match(/(.+) <(.+@.+)>/);
					if (!!match) {
						metadata.author = match[1];
						metadata.email = match[2];
					}
				}
				if (name == 'Subject') {
					metadata.title = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "").trim();
				}
			});

			form.on('part', function(part) {
				part.on('error', function(err) {
					console.error("Part error: ", err);
				});

				if (part.filename) {
					console.log('File: ' + part.name);

					var domain = "liveevents"
					var year = new Date().getFullYear().toString();

					imageManager.saveImage(domain, year, eventname, metadata, part);
				} else {
					part.resume();
				}
			});

			form.on('error', function(err) {
				console.error("Form error: ", err);
				res.status(500).end();
			})

			form.on('close', function() {
				res.status(200).end();
			});

			form.parse(req);
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
	};
};

module.exports = HttpServer;