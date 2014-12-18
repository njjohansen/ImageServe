'use strict';

angular.module('NCEventsApp')
	.service('$$eventDataService', function($rootScope, $http){

		this.getDomains = function(){
			//get domains
		    var promise = $http.get('http://afterdark.netcompany.com:1337/list/domain/').
				success(function(domains) {
					return domains;
				});

			return promise;
		};

		//get years for chosen domain
		this.getYears = function(domain){
			return $http.get('http://afterdark.netcompany.com:1337/list/'+domain+'/year').
				success(function(years) {
					return years;
				});
		};

		//get events for chosen domain/year
		this.getEvents = function(domain, year){
			return $http.get('http://afterdark.netcompany.com:1337/list/'+domain+'/'+year+'/event').
				success(function(events) {
					return events;
				});
		};

		//get iamges for chosen domain/year/event
		this.getImages = function(domain, year, ncEvent){
			$http.get('http://afterdark.netcompany.com:1337/list/'+domain+'/'+year+'/'+ncEvent.eventId+'/image').
				success(function(images) {
					var data = {
						allImages: images,
						url: 'http://afterdark.netcompany.com:1337/image/'+domain+'/'+year+'/'+ncEvent.eventId,
					};
					$rootScope.$emit('imagesReady', data);
				});
		};
	});