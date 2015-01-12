'use strict';

angular.module('NCEventsApp')
	.service('$$eventDataService', function($rootScope, $http){
		var baseUrl = 'http://afterdark.netcompany.com:1337/';
		this.getDomains = function(){
			//get domains
		    var promise = $http.get(baseUrl+'list/domain/').
				success(function(domains) {
					return domains;
				});

			return promise;
		};

		//get years for chosen domain
		this.getYears = function(domain){
			return $http.get(baseUrl + 'list/'+domain+'/year/').
				success(function(years) {
					return years;
				});
		};

		//get events for chosen domain/year
		this.getEvents = function(domain, year){
			return $http.get(baseUrl+ 'list/'+domain+'/'+year+'/event/').
				success(function(events) {
					return events;
				});
		};

		//get iamges for chosen domain/year/event
		this.getImages = function(domain, year, ncEvent){
			$http.get(baseUrl + 'list/'+domain+'/'+year+'/'+ncEvent.eventId+'/image/').
				success(function(obj) {
					var data = {
						images: obj.images,
						eventData: obj.metadata,
						imageUrlLarge: baseUrl + 'image/'+domain+'/'+year+'/'+ncEvent.eventId,
						imageUrlThumb: baseUrl + 'thumb/'+domain+'/'+year+'/'+ncEvent.eventId,
					};
					$rootScope.$emit('imagesReady', data);
				});
		};
	});