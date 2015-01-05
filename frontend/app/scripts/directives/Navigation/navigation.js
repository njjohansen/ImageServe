'use strict';


/**
 * Directive for the navigation
 */
angular.module('NCEventsApp')
    .directive('navigation',  ['$location', function($location) {
        return {
            restrict: 'AE', 
            replace: 'true',
            templateUrl: 'scripts/directives/Navigation/navigation.html',
            link: function($scope, element, attrs) {

            }
        };
    }]);