'use strict';

angular.module('NCEventsApp')
	.service('$$eventDataService', function($rootScope, $http) {
		$rootScope.chosenDomain = 'aarbog'; //TODO: un-hardcode

		var baseUrl = 'http://event.netcompany.com/api';
		this.getDomains = function() {
			//get domains
		    var promise = $http.get(baseUrl+'/').
				success(function(domains) {
					return domains;
				});

			return promise;
		};

		//get years for chosen domain
		this.getYears = function(domain) {
			return $http.get(baseUrl + '/'+domain+'/years/').
				success(function(years) {
					return years;
				});
		};

		//get events for chosen domain/year
		this.getEvents = function(domain, year) {
			return $http.get(baseUrl + '/'+domain+'/years/'+year+'/events').
				success(function(events) {
					//console.log(events);
					return events;
				});
		};

		//get images for chosen domain/year/event
		this.getImages = function(domain, year, eventId) {
			var imagesBase = baseUrl + '/'+domain+'/years/'+year+'/events/'+eventId+'/images';
			$http.get(imagesBase).
				success(function(obj) {
					var data = {
						images: obj.images,
						eventData: obj.metadata,
						imageUrlLarge: imagesBase+'/large',
						imageUrlThumb: imagesBase+'/thumb',
					};
					$rootScope.$emit('imagesReady', data);
				});
		};
	});