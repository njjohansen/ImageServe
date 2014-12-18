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

    	 $rootScope.$on('imagesReady', function(event, data) { 
    	 	$scope.hideSplash = true;

    	 	$scope.images = data.allImages; 
    	 	$scope.url = data.url;
    	 });
    });
