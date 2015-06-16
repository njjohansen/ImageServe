var gm = require('gm');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var pass = require('stream').PassThrough;
var imagesize = require('imagesize');

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
			var workerInfo = {imagesProcessing: 0};
			extractDomains("", workerInfo);
		});
		
	};

	var extractDomains = function (p, workerInfo) {	
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractYears(pN, workerInfo);
			});
		});
	};

	var extractYears = function(p, workerInfo){
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractEvents(pN, workerInfo);
			});
		});
	};

	var extractEvents = function(p, workerInfo){
		foreachDir(path.join(SRCPREFIX, p), function(dirPath, dirName){
			var pN = path.join(p, dirName);
			var paths = [];
			paths.push(path.join(CACHEPREFIX, THUMBPREFIX, pN));
			paths.push(path.join(CACHEPREFIX, LARGEPREFIX, pN));
			ensureDirs(paths, function(){
				extractImages(pN, workerInfo);
			});
		});
	};

	var extractImages = function(p, workerInfo){

		foreachImage(path.join(SRCPREFIX, p), function(imgPath, imgName){
			var pN = path.join(p, imgName);
			//console.log('\t\tImage found: ' + imgName + "("+ imgPath+")");
			copyImages(pN, workerInfo);
		});
	};

	var MAXPROCESSING = 10;
	var copyImages = function(p, workerInfo){
		var srcPath = path.join(SRCPREFIX, p);
		var cachePathThumb = path.join(CACHEPREFIX, THUMBPREFIX, p);
	
		fs.exists(cachePathThumb, function(thumbExists){			
			if( !thumbExists && workerInfo.imagesProcessing < MAXPROCESSING) {
				workerInfo.imagesProcessing++;
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
			if( !largeExists && workerInfo.imagesProcessing < MAXPROCESSING){
				workerInfo.imagesProcessing++;
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

	// from http://lmws.net/making-directory-along-with-missing-parents-in-node-js
	fs.mkdirParent = function(dirPath, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), callback);
      //And then the directory
      fs.mkdirParent(dirPath, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
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

	// callback arg: {imageFile: <filename>, metadataFile: <filename>]
	var getImages = function(orgPath, callback){
		var images = {};

		var addProp = function(fName, propName, value){
			var fileId = fName.substring(0,fName.lastIndexOf('.')).toLowerCase();
			if(typeof images[fileId] == 'undefined'){
				images[fileId] = {};
			}
			images[fileId][propName] = value;
		}

		fs.readdir(orgPath, function(err, files){
			if( err) throw err;
			for(var i = 0; i < files.length; i++){
				var fName = files[i];
				var fPath = path.join(orgPath, fName);
				var stat = fs.statSync(fPath);
				if( isImage(fName, stat) ){
					addProp(fName, "imageFile", fName);
					addProp(fName, "imagePath", fPath);
				}
				else if( isJson(fName, stat) ){
					addProp(fName, "metadataFile", fName);
					addProp(fName, "metadataPath", fPath);
				}
			}

			// convert obj to array and return
			var list = [];
			//console.log(JSON.stringify(images));
			for( var k in images){
				if( typeof images[k].imageFile !== 'undefined')
					list.push(images[k]);
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
				filename.substr(-5).toLowerCase() === '.jpeg' ||
				filename.substr(-4).toLowerCase() === '.png'
			) );
	};

	var isJson = function(filename, stat){
		return (stat.isFile() && 
			(
				filename.substr(-5).toLowerCase() === '.json'
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

	var readJsonFromFileSync = function (filepath) {
		console.log("Reading METADATA: " + filepath);
		if(fs.existsSync(filepath)){
	    	data = fs.readFileSync(filepath, 'utf8');
            if( typeof data !== 'undefined'){
            	try{
            		console.log("Read METADATA: " + data);
            		var jsonData = JSON.parse(escapeSpecialChars(data));
					console.log("Read METADATA2: " + JSON.stringify(jsonData));
            		return jsonData;
            	}
            	catch(err){
            		console.log("Err. loading: " + filepath);
            		console.log("Invalid JSON: " + data);
            		console.log("Error text: " + err);
            	}
            }
            else{
            	console.log("METADATA unavailable: " + filepath);
            }
    	}
		else{
	    	console.log("File not exist: '" + filepath + "'");
	    }
    	return null;
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

		// TODO: here we ougth to search images-list for metadataFile and read content
		// of the file
		for( var i = 0; i < images.length; i++){
			var path = images[i].metadataPath;
			if( path != null ){
				images[i].metadata = readJsonFromFileSync(path);
				console.log("Read METADATA3: " + JSON.stringify(images[i].metadata));
			}
		}
		
		// return
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

	this.saveImage = function(domainId, yearId, eventId, metadata, stream) {
		var date = new Date();
		metadata['time'] = date.toISOString();

		var a = new pass;
		var b = new pass;

		stream.pipe(a);
		stream.pipe(b);

		imagesize(a, function (err, result) {
  		if (err) {
  			console.error("Probably not an image");
  			return;
  		}
  		if (result.height*result.width < 100*100) {
  			console.log("Image "+result.height+"x"+result.width+" is too small. Ignored");
  			return;
  		}

  		metadata["height"] = result.height;
  		metadata["width"] = result.width;

			var imagepath = path.join(__dirname, SRCPREFIX, domainId, yearId, eventId);

			var metadataFile = path.join(imagepath, date.toISOString().replace(/:/g, '-')+'.json');
			var imageFile = path.join(imagepath, date.toISOString().replace(/:/g, '-')+path.extname(stream.filename));

			fs.mkdirParent(imagepath, function() {
				fs.writeFile(metadataFile, JSON.stringify(metadata), function(err) {
					if (err) {
						return console.error(err);
					}

					b.pipe(fs.createWriteStream(imageFile));
				});
			});
		});
	};
}

module.exports = new ImageManager();
