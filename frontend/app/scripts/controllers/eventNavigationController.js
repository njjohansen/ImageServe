'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('eventNavCtrl', function($scope, $http, $$eventDataService) {

        $scope.currentStep = 'domains';

        //--------- show hide stuff --------

        $scope.showBackBtn = function() {
            if ($scope.currentStep !== 'domains') {
                return true;
            }
            return false;
        };

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
            $scope.currentStep = $scope.currentStep;
            $scope.selectedIndex = -1;
            if($scope.currentStep === 'events'){
                $scope.currentStep = 'years';
            }
            else if($scope.currentStep === 'years'){
                $scope.currentStep = 'domains';
            }
        };

        //--------- initialize menu ---------
        $$eventDataService.getDomains().then(function(domains) {
            $scope.domains = domains.data;
        });
    });
