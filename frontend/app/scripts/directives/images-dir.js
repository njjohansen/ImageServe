'use strict';
/*global $:false */

/**
 * Used instead of $('document').ready. Images arrive async and ng-repeat must be done.  
 */
angular.module('NCEventsApp')
    .directive('image', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope) {
            if (scope.$last === true) { //last repeat
                $timeout(function () {
                    $('.fancybox').fancybox();
                });
            }
        }
    };
});