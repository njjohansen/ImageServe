'use strict';

/**
 * @ngdoc overview
 * @name NCEventsApp
 * @description
 * # NCEventsApp
 *
 * Main module of the application.
 */
angular
  .module('NCEventsApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/aarbog/2014', {
        templateUrl: 'views/aarsbog_2014.html'//,
        //controller: 'AddOrderController'
      })
      .when('/aarbog/2014/:eventName', { //:eventName*
        templateUrl: 'views/eventview.html'
      });
      /*.otherwise({
        redirectTo: '/'
      });*/
  });