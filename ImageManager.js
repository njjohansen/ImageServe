var gm = require('gm');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var ImageManager = function(){
	var THUMBPREFIX = "thumb";
	var LARGEPREFIX = "large";
	var CACHEPREFIX = "cache";
	var SRCPREFIX = "images";

	this.process = function(){
		console.log("Processing images..");
		
		var paths = [];
		paths.push(path.join(CACHEPREFIX));
		paths.push(path.join(CACHEPREFIX, THUMBPREFIX));
		paths.push(path.join(CACHEPREFIX, LARGEPREFIX));
		ensureDirs(paths, function(){
			extractDomains("");
		});
		
	};

	var extractDomains = function (p) {
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractYears(pN);
			});
		});
	};

	var extractYears = function(p){
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractEvents(pN);
			});
		});
	};

	var extractEvents = function(p){
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractImages(pN);
			});
		});
	};

	var extractImages = function(p){
		foreachImage(path.join(SRCPREFIX, p), function(imgPath, imgName){
			var pN = path.join(p, imgName);
			//console.log('\t\tImage found: ' + imgName + "("+ imgPath+")");
			copyImages(pN);
		});
	};

	var copyImages = function(p){
		var srcPath = path.join(SRCPREFIX, p);
		var cachePathThumb = path.join(CACHEPREFIX, THUMBPREFIX, p);
		fs.exists(cachePathThumb, function(thumbExists){			
			if( !thumbExists ){
				console.log('\t\tCreating thumb: ' + p + "("+ cachePathThumb+")");
				// target thumb images does not exist	
				//console.log(srcPath+"->"+cachePathThumb);			
				gm(srcPath)
				.resize(128,128)
				.autoOrient()
				.write(cachePathThumb, function(err){if(err){console.log("" + err);}});
			}
		});

		var cachePathLarge = path.join(CACHEPREFIX, LARGEPREFIX, p);
		fs.exists(cachePathLarge, function(largeExists){
			if(!largeExists){
				console.log('\t\tCreating image: ' + p + "("+ cachePathLarge+")");
				// target large images does not exist
				gm(srcPath)
				.resize(1024,1024)
				.autoOrient()
				.write(cachePathLarge, function(err){if(err){console.log("" + err);}});	

			}
		});
	};

	var ensureDirs = function(ps, callback){
		var i = 0;
		var localCallback = function(err){
			if( err ) console.log(err);
			if( i < ps.length){
				i++;
				ensureDir(ps[i-1], localCallback);
			}
			else
				callback();
		};
		localCallback();
	};

	var ensureDir = function(p, callback){
		fs.exists(p, function(exist){
			if(!exist){
				fs.mkdir(p, callback);
				//fs.mkdir(p, function(err){
				//	if(err) console.log(err);
				//	callback();
				//});
			}
			else
				callback();
		});
	};

	var getDirs = function(orgPath, callback){
		var list = [];
		fs.readdir(orgPath, function(err, files){
			if( err) throw err;
			for(var i = 0; i < files.length; i++){
				var dName = files[i];
				var dPath = path.join(orgPath, dName);
				var stat = fs.statSync(dPath);
				if(stat.isDirectory() )
					list.push(dName);
			}
			callback(list);
		});
	};

	var getImages = function(orgPath, callback){
		var list = [];
		fs.readdir(orgPath, function(err, files){
			if( err) throw err;
			for(var i = 0; i < files.length; i++){
				var fName = files[i];
				var fPath = path.join(orgPath, fName);
				var stat = fs.statSync(fPath);
				if( isImage(fName, stat) )
					list.push(fName);
			}
			callback(list);
		});
	};

	var getDirsSync = function(orgPath){
		var list = [];
		var files = fs.readdirSync(orgPath);
		for(var i = 0; i < files.length; i++){
			var dName = files[i];
			var dPath = path.join(orgPath, dName);
			var stat = fs.statSync(dPath);
			if(stat.isDirectory() )
				list.push(dName);
		}
		return list;
	};

	var foreachDir = function(orgPath, callback){
		var isDir = function(dPath, d){
			fs.stat(dPath, function(err, stat){
				if( stat.isDirectory()){
					callback(dPath, d);
				}
			});
		};

		fs.readdir(orgPath, function(err, files){
			if( err) throw err;
			for(var i = 0; i < files.length; i++){
				var dName = files[i];
				var dPath = path.join(orgPath, dName);
				isDir(dPath, dName);
			}
			//files = files.filter(function(file) { return file.substr(-4).toLowerCase() === '.jpg'; })
		});
	};

	var isImage = function(filename, stat){
		return (stat.isFile() && 
			(
				filename.substr(-4).toLowerCase() === '.jpg' ||
				filename.substr(-4).toLowerCase() === '.png'
			) );		
	};

	var foreachImage = function(orgPath, callback){
		var isImageLocal = function(fPath, fName){
			fs.stat(fPath, function(err, stat){
				if( isImage(fName, stat) )
					callback(fPath, fName);
			});
		};

		fs.readdir(orgPath, function(err, files){
			if( err) throw err;
			for(var i = 0; i < files.length; i++){
				var fName = files[i];
				var fPath = path.join(orgPath, fName);
				isImageLocal(fPath, fName);
			}
		});
	};

	var escapeSpecialChars = function(jsonString) {
	    return jsonString.replace(/\n/g, "")
	        .replace(/\r/g, "")
	        .replace(/\t/g, "")
	        .replace(/\f/g, "");

	};

	var readJsonFromFile = function (filepath, callback) {
		fs.exists(filepath, function(exist){
			if( exist){
		    	fs.readFile(filepath, 'utf8', function (err, data) {    		
		            if (err) throw err;
		            if( typeof data !== 'undefined')
		            	try{
		            		callback(JSON.parse(escapeSpecialChars(data)));	
		            	}
		            	catch(err){
		            		console.log("Err. loading: " + filepath);
		            		console.log("Invalid JSON: " + data);
		            		console.log("Error text: " + err);
		            	}
		            	
		            //Do your processing, MD5, send a satellite to the moon, etc.
		            // fs.writeFile(savPath, data, function(err) {
		            //     if (err) throw err;
		            //     console.log('complete');
		            // });
		        });
	    	}
	    	else {
	    		callback(null);
	    	}
    	});
	};

	var enrichWithJson = function(item, callback){
		var filepath = path.join(SRCPREFIX, item.domainId, item.yearId, item.eventId, 'metadata.txt');
		readJsonFromFile(filepath, function(jsonMetadata){
			item.metadata = jsonMetadata;
			callback();
		});
	};

	var enrichEvents = function(domainId, yearId, eventlist, callback){
		var enriched = eventlist.map(function(curVal, index, array){ 
			return {
				'eventId': curVal,
				'domainId': domainId,
				'yearId': yearId
			};
		});

		var enrichedCount = 0;
		for(var i = 0; i < enriched.length; i++){
			enrichWithJson(enriched[i], function(){
				if(++enrichedCount >= enriched.length)
					callback(enriched);
			});
		};
	};

	var enrichImages = function(domainId, yearId, eventId, images, callback){
		var enriched = {
			'eventId': eventId,
			'domainId': domainId,
			'yearId': yearId
		};

		enrichWithJson(enriched, function(){
			enriched.images = images;
			callback(enriched);
		});

	};

	this.listDomains = function(callback){
		getDirs(path.join(SRCPREFIX, ""), function(dirList){
			callback(dirList);
		});
	};

	this.listYears = function(domainId, callback){
		getDirs(path.join(SRCPREFIX, domainId), function(dirList){
			callback(dirList);
		});
	};	

	this.listEvents = function(domainId, callback){		
		var list = [];
		var years = getDirsSync(path.join(SRCPREFIX, domainId));
		var yearsSearched = 0;
		for(var i = 0; i < years.length; i++){
			var events = getDirsSync(path.join(SRCPREFIX, domainId, years[i]));
			// enrich event list with metadata
			enrichEvents(domainId, years[i], events, function(enrichedEvents){
				list = list.concat(enrichedEvents);				
				if(++yearsSearched >= years.length)
					callback(list);
			});			
		}
	};	

	this.listYearEvents = function(domainId, yearId, callback){
		getDirs(path.join(SRCPREFIX, domainId, yearId), function(events){
			enrichEvents(domainId, yearId, events, callback);
		});
	};

	this.listImages = function(domainId, yearId, eventId, callback){
		getImages(path.join(SRCPREFIX, domainId, yearId, eventId), function(imgList){
			enrichImages(domainId, yearId, eventId, imgList, callback);
			//callback(imgList);
		});
	};	

}

module.exports = new ImageManager();