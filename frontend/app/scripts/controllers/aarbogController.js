'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('aarbogCtrl', function($scope, $route) {
        $scope.urlYear = $route.current.params.year;
        $scope.urlEvent = $route.current.params.eventName;

        $scope.subView = (typeof $scope.urlEvent === 'undefined') ? 'views/aarsbog_' + $scope.urlYear + '.html' : 'views/eventview.html';
        // google analytics
        /* jshint ignore:start */
		ga('send', 'pageview', '/#/aarbog/' + $scope.urlYear + '/' + $scope.urlEvent + '/');
		/* jshint ignore:end */
        
    });        
