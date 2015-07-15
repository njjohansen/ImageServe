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
    'ngTouch',
    'ngPhotoSwipe'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      /*.when('/aarbog/2013', {
        templateUrl: 'views/aarsbog_2013.html'//,
        //controller: 'AddOrderController'
      })
      .when('/aarbog/2013/:eventName', { //:eventName*
        templateUrl: 'views/eventview.html'
      })*/
      .when('/', {
        templateUrl: 'views/frontpage.html',
        controller: 'frontpageCtrl',     
      })  
      .when('/liveevent', { 
        templateUrl: 'views/liveeventalbum.html',
        controller: 'liveEventAlbumController'
      })
      .when('/aarbog/:year/', {
        templateUrl: 'views/aarbog.html',
        controller: 'aarbogCtrl'
      })
      .when('/aarbog/:year/:eventName', { //:eventName*
        templateUrl: 'views/aarbog.html',
        controller: 'aarbogCtrl'
      })
      .when('/live/', { //:eventName*
        templateUrl: 'views/liveevent.html',
        controller: 'liveEventController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });