'use strict';

/**
 * @ngdoc function
 * @name NCEventsApp.controller:eventNavCtrl
 * @description
 * # eventNavCtrl
 * Controller of the NCEventsApp
 */
angular.module('NCEventsApp')
    .controller('viewAreaCtrl', function($scope, $rootScope, $location, $$eventDataService) {
        var path = $location.path();
        var pathParts = (path).split('/');
        var eventID = pathParts[pathParts.length-1];

        $$eventDataService.getImages($rootScope.chosenDomain, $rootScope.chosenYear, eventID); //fetch images from server

        $scope.eventName = eventID;

        
        if(eventID === 'cocktails' || eventID === 'Dark' || eventID === 'Royale' || eventID === 'Wonderland'){
            $scope.LogoName ='afterdark';
        }else if(eventID === 'badass'){
            $scope.LogoName ='badass';
        }else if(eventID === 'festudvalget'){
            $scope.LogoName ='festudvalget';
        }else if(eventID === 'heidi'){
            $scope.LogoName ='iso9000';
        }else if(eventID === 'executers'){
            $scope.LogoName ='executers';
        }else if(eventID === 'sprint'){
            $scope.LogoName ='sprint';
        }else{
            $scope.LogoName ='afterdark';
        }

        $scope.images = null;
        $scope.description = '';

    	var insertImages = function(description){
    		if(typeof description !== 'undefined' ){
    			return description
                    .replace(/{{[a-zæøå\ _\-0-9\.]*}}/gi, 
                        function(match){ return '<img src=\"'+$scope.imageUrlLarge+'/'+match.substr(2, match.length-4)+'\"/>';}
                    );
            }
    	};

    	$rootScope.$on('imagesReady', function(event, data) { 
    	 	$scope.imageUrlLarge = data.imageUrlLarge;
    	 	$scope.imageUrlThumb = data.imageUrlThumb;    	 	
    	 	$scope.images = data.images; 
    	 	$scope.title = data.eventData.title; 
            $scope.author = data.eventData.author; 
    	 	$scope.description = insertImages(data.eventData.description); 

    	 });
    });
