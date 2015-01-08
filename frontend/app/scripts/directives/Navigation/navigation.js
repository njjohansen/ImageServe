'use strict';


/**
 * Directive for the navigation
 */
angular.module('NCEventsApp')
    .directive('navigation',  ['$location', function($location) {
        return {
            restrict: 'AE', 
            replace: 'true',
            templateUrl: 'views/navigation.html',
            link: function($scope, element, attrs) {

            }
        };
    }]);