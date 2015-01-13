'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('viewAreaCtrl', function($scope, $rootScope, $location, $$eventDataService) {
        var path = $location.path();
        var pathParts = (path).split('/');
        var eventID = pathParts[pathParts.length-1];

        $$eventDataService.getImages($rootScope.chosenDomain, $rootScope.chosenYear, eventID); //fetch images from server

        $scope.eventName = eventID;

        $scope.LogoName ='afterdark';

        $scope.images = null;
        $scope.description = '';

    	var insertImages = function(description){
    		if(typeof description !== 'undefined' ){
    			return description
                    .replace(/{{[a-zæøå\ _\-0-9\.]*}}/gi, 
                        function(match){ return '<img src=\"'+$scope.imageUrlLarge+'/'+match.substr(2, match.length-4)+'\"/>';}
                    );
            }
    	};

    	$rootScope.$on('imagesReady', function(event, data) { 
            console.log('Controller event: \'imagesReady\'');
    	 	$scope.hideSplash = true;
            
    	 	$scope.imageUrlLarge = data.imageUrlLarge;
    	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
    	 	$scope.images = data.images; 
    	 	$scope.title = data.eventData.title; 
            $scope.author = data.eventData.author; 
    	 	$scope.description = insertImages(data.eventData.description); 

    	 });
    });
