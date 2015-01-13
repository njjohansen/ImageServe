'use strict';


/**
 * Used in staed of $('document').ready. Images arrive async and ng-repeat must be done.  
 */
angular.module('NCEventsApp')
    .directive('image', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope) {
        	console.log(scope);
            if (scope.$last === true) {
                $timeout(function () {
                	$(".fancybox").fancybox();
                });
            }
        }
    };
});