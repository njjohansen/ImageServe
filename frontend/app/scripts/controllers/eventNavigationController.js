'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('eventNavCtrl', function($scope, $rootScope, $location, $http, $$eventDataService) {

        $scope.currentStep = 'domains';

        //--------- show hide stuff --------

        $scope.showBackBtn = function() {
            if ($scope.currentStep !== 'domains') {
                return true;
            }
            return false;
        };

        //-------- set nav based on $location.path -----

            //TODO: change nav based on direct url change in browser adress field. Only on browser forward and backwards buttons (måske brug: $scope.$watch('$location.path()', function(locationPath)) 

        //-------- Clicks -------

        $scope.domainClick = function(domain) {
            $scope.chosenDomain = domain;
            $scope.currentStep = 'years';
            $$eventDataService.getYears($scope.chosenDomain).then(function(years) { //service returns 'promise', to that we can wait for response with data, then inserts.
                $scope.years = years.data;
            });
        };

        $scope.yearClick = function(year) {
            $scope.chosenYear = year;
            $scope.currentStep = 'events';
            $$eventDataService.getEvents($scope.chosenDomain, $scope.chosenYear).then(function(events) {
                $scope.events = events.data;
            });
        };

        $scope.eventClick = function(event, index) {
            $scope.chosenEvent = event;
            $scope.selectedIndex = index; 
            $$eventDataService.getImages($scope.chosenDomain, $scope.chosenYear, $scope.chosenEvent); 
        };

        $scope.backClick = function() {
            //nav change
            $scope.currentStep = $scope.currentStep;
            $scope.selectedIndex = -1;
            if($scope.currentStep === 'events'){
                $scope.currentStep = 'years';
            }
            else if($scope.currentStep === 'years'){
                $scope.currentStep = 'domains';
            }

            //url back
            window.history.back();
        };

        //--------- initialize menu ---------
        $$eventDataService.getDomains().then(function(domains) {
            $scope.domains = domains.data;
        });
    });
