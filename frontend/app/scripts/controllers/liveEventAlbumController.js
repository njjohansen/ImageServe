'use strict';

angular.module('NCEventsApp')
    .controller('liveEventAlbumController', function($scope, $rootScope, $route, $window, $$eventDataService) {
        // here you setup event master data
        var chosenDomain = 'liveevents';
        var eventYear = '2015'; 
        var eventID = 'fangst';
        // end of event master data
        $scope.eventID = eventID;
  //        //fetch images from server

		// $scope.imageUrlLarge = '';
		// $scope.imageUrlThumb = '';
		// $scope.images = null;
        var makeCaption = function(image){
            if(typeof image.metadata !== 'undefined' && image.metadata !== null){
                return '`' + image.metadata.title + '` af ' + image.metadata.author + '';
            }
            else{
                return image.imageFile;
            }
        };

     	$rootScope.$on('imagesReady', function(event, data) { 
            console.log(data);
            for (var i = data.images.length-1; i >= 0 ; i--) {
                var image = data.images[i];
                $scope.images.push({ 
                    src: data.imageUrlLarge + '/' + image.imageFile,
                    safeSrc: data.imageUrlLarge + '/' + image.imageFile,
                    thumb: data.imageUrlThumb + '/' + image.imageFile,
                    caption: makeCaption(image),
                    size: screenSize(image.metadata),
                    type: 'image'
                });
            }

  //   	 	$scope.imageUrlLarge = data.imageUrlLarge;
  //   	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
  //   	 	$scope.images = data.images; 
     	 });

        var screenSize = function (imageMetadata) {
            var x = $window.innerWidth;
            var y = $window.innerHeight;

            if( typeof imageMetadata != 'undefined'){
                if (imageMetadata.scaledWidth != null && imageMetadata.scaledHeight != null) {
                    x = imageMetadata.scaledWidth;
                    y = imageMetadata.scaledHeight;
                    console.log("Detected: " + x + "," + y);
                }
            }
            
            return x + 'x' + y;
        }; 

        $scope.images = [];
        var init = function(){                
            $$eventDataService.getImages(chosenDomain, eventYear, eventID);
        };     

        init();

    });        
