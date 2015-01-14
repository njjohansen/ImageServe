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

        // initialize menu with events
        $$eventDataService.getEvents($rootScope.chosenDomain, $rootScope.chosenYear).then(function(events) {

            events.data = events.data.sort(function(a, b){
                if( typeof a.metadata === 'undefined' || typeof b.metadata === 'undefined' ){
                    return 0;
                }
                if(a.metadata.sortkey < b.metadata.sortkey){ return -1;}
                if(a.metadata.sortkey > b.metadata.sortkey){ return 1;}
                return 0;
            });

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
