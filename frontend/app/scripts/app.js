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
      .otherwise({
        redirectTo: '/'
      });
  });
