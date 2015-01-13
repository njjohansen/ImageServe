'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('aarbogNavigationCtrl', function($scope, $rootScope, $location, $http, $$eventDataService) {

        var chosenDomain = 'aarbog';
        var chosenYear = '2014';
        
        /*$scope.eventClick = function(event) {
            console.log(event.eventId);
            $$eventDataService.getImages(chosenDomain, chosenYear, event); 
        };*/

        // initialize menu
        $$eventDataService.getEvents(chosenDomain, chosenYear).then(function(events) {
            var halfLength = Math.ceil(events.data.length / 2);    
            $scope.leftMenu = events.data.splice(0, halfLength-1); //splice removes elements from event.data
            $scope.rightMenu = events.data; //remaining in last part of menu
        });
    })
    .filter('rawHtml', ['$sce', function($sce){
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }]);
