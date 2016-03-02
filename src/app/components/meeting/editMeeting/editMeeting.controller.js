(function() {
	'use strict';

	angular
	.module('editMeetingModule')
	.controller('EditMeetingController', EditMeetingController);

	/** @ngInject */
	function EditMeetingController($q, $window, $log, api, $state, $stateParams, NgMap, Meeting, User, logonService, categories) {
		var vm = this;
		var _id = $stateParams._id || null;
		var meeting = new Meeting(_id);
    var inProgress = false;
    var marker = new $window.google.maps.Marker();
    var meetingKeys = [];

		vm.meeting = {};
    vm.infoBoxMessage = '';
    vm.currentUserId = null;
    vm.categories = [];
    vm.getCoordinates = getCoordinates;
    vm.updateMeeting = updateMeeting;

    categories.getCategories().then(
      function(results) {
        vm.categories = results;
      }
    );

		meeting.getData().then(function() {
			vm.meeting = meeting.data;
      meetingKeys = Object.keys(meeting.data);
			showVenueOnMap(vm.meeting);

      logonService.isLogged().then(
        function(results) {
          vm.currentUserId = results;
        },
        function() {
          vm.currentUserId = null;
        }
      );
		});

    /////////////////

		// function responsible for displaying map and inserting marker on the venue location
		function showVenueOnMap(meeting) {
			if (!angular.isObject(meeting)) {
				return;
			}

			NgMap.getMap().then(function(map) {
				var lat = meeting.venue_coordinates.lat;
				var lng = meeting.venue_coordinates.lng;
				$log.log('lat: ' + lat + ', lng: ' + lng);
				var latlng = new $window.google.maps.LatLng(lat, lng);
				resetMarker();
				marker.setPosition(latlng);
				marker.setMap(map);
				map.setCenter(latlng);
			});
		}

    function geocodeAddress(venue, resultsMap) {
      return $q(function(resolve, reject) {
        var geocoder = new $window.google.maps.Geocoder();
        var address = venue;

        geocoder.geocode({'address': address}, function(results, status) {
          if (status === $window.google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            resetMarker();
            marker.setMap(resultsMap);
            marker.setPosition(results[0].geometry.location);
            resultsMap.setZoom(14);
            resolve(results[0].geometry.location);
          } else {
            reject('Adres nie został znaleziony. Błąd: ' + status);
          }
        });
      });
    }

    // function responsible for displaying map and inserting marker on the venue location
    function getCoordinates(venue) {
      return $q(function(resolve, reject) {
        if (typeof venue === 'undefined') {
          $log.log('Brak danych adresowych.');
          return reject('Brak danych adresowych.');
        }

        NgMap.getMap().then(function(map) {
          $log.log('w map then.');

          geocodeAddress(venue, map)
          .then(
            function(results) {
              $log.log('coordinates: ' + angular.toJson(results));
              vm.meeting.venue_coordinates = results;
            },
            function(results) {
              $log.log(angular.toJson(results));
            }
          );
        });
      });
    }

    function resetMarker() {
      marker.setMap(null);
    }

    function updateMeeting(meetingObject) {
      meeting.updateMeeting(meetingObject).then(
        function(results) {
          //vm.meeting = results;
          vm.infoBoxMessage = 'Zmiany zostały zapisane.';
        },
        function(err) {
          vm.infoBoxMessage = 'Zmiany nie zostały zapisane. Błąd: ' + err;
        }
      );
    }

    function refresh() {
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    }
	}
})();
