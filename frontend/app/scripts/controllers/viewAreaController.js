'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('viewAreaCtrl', function($scope, $rootScope) {

    	var insertImages = function(description){
    		if(typeof description !== 'undefined')
    			return description.replace(/{{[a-zæøå\ _\-0-9\.]*}}/gi, 
    									function(match){ return "<img src='"+$scope.imageUrlLarge+"/"+match.substr(2, match.length-4)+"'/>"});
    	};

    	$rootScope.$on('imagesReady', function(event, data) { 
    	 	$scope.hideSplash = true;

    	 	$scope.imageUrlLarge = data.imageUrlLarge;
    	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
    	 	$scope.images = data.images; 
    	 	$scope.description = insertImages(data.eventData.description); 

    	 });
    });
