'use strict';

angular.module('NCEventsApp')
    .controller('liveEventController', function($scope, $rootScope, $route, $$eventDataService) {
		// here you setup event master data
        var chosenDomain = 'aarbog';
        var eventYear = '2014'; 
        var eventID = 'royale';
        // end of event master data
        
        $$eventDataService.getImages(chosenDomain, eventYear, eventID); //fetch images from server

		$scope.imageUrlLarge = '';
		$scope.imageUrlThumb = '';
		$scope.images = null;

    	$rootScope.$on('imagesReady', function(event, data) { 
    	 	$scope.imageUrlLarge = data.imageUrlLarge;
    	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
    	 	$scope.images = data.images; 
    	 });
    });        
