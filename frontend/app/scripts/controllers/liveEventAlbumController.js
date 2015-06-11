'use strict';

angular.module('NCEventsApp')
    .controller('liveEventAlbumController', function($scope, $rootScope, $route, $window, $$eventDataService) {
        // here you setup event master data
        var chosenDomain = 'liveevents';
        var eventYear = '2015'; 
        var eventID = 'sommer';
        // end of event master data
        
  //        //fetch images from server

		// $scope.imageUrlLarge = '';
		// $scope.imageUrlThumb = '';
		// $scope.images = null;
        var makeCaption = function(image){
            if(typeof image.metadata !== 'undefined' && image.metadata !== null){
                return image.metadata.title + ' | ' + image.metadata.author;
            }
            else{
                return image.imageFile;
            }
        };

     	$rootScope.$on('imagesReady', function(event, data) { 
            console.log(data);
            for (var i = 0; i < data.images.length; i++) {
                var image = data.images[i];
                $scope.images.push({ 
                    src: data.imageUrlLarge + '/' + image.imageFile,
                    safeSrc: data.imageUrlLarge + '/' + image.imageFile,
                    thumb: data.imageUrlThumb + '/' + image.imageFile,
                    caption: makeCaption(image),
                    size: screenSize(1024, 679),
                    type: 'image'
                });
            }

  //   	 	$scope.imageUrlLarge = data.imageUrlLarge;
  //   	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
  //   	 	$scope.images = data.images; 
     	 });

        var screenSize = function (width, height) {
            var x = width ? width : $window.innerWidth;
            var y = height ? height : $window.innerHeight;
            
            return x + 'x' + y;
        }; 

        $scope.images = [];
        var init = function(){                
            $$eventDataService.getImages(chosenDomain, eventYear, eventID);
        };     

        init();

    });        
