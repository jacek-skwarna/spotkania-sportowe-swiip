(function() {
	'use strict';

	angular
	.module('meetingModule')
	.controller('MeetingController', MeetingController);

	/** @ngInject */
	function MeetingController($q, $window, $log, api, $state, $stateParams, NgMap, Meeting, User, isLoggedIn) {
		var vm = this;
		var _id = $stateParams._id || null;
		var meeting = new Meeting(_id);
		var meetingOwner = {};
    var inProgress = false;
    var currentUserId = isLoggedIn;

    $log.log('currentUserId: ' + currentUserId);

    vm.joinMeeting = joinMeeting;
		vm.meeting = {};
		vm.meetingOwner = {};
    vm.infoBoxMessage = '';

		meeting.getData().then(function() {
			vm.meeting = meeting.data;
			initMeetingOwner(vm.meeting.owner_id);
			showVenueOnMap(vm.meeting);
		});

    /////////////////

		// function responsible for initializing meeting's owner object
		function initMeetingOwner(userId) {
			if (typeof userId === 'undefined') {
				return;
			}

			meetingOwner = new User(userId);
			return meetingOwner.getData()
			.then(function() {
				vm.meetingOwner = meetingOwner.data;
			});
		}

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
				var venueMarker = new $window.google.maps.Marker();
				venueMarker.setPosition(latlng);
				venueMarker.setMap(map);
				map.setCenter(latlng);
			});
		}

    function joinMeeting() {
      vm.infoBoxMessage = '';

      if (inProgress) {
        $log.log('joinMeeting in progress.');
        vm.infoBoxMessage = 'Zapisywanie w toku.';
        return;
      }

      inProgress = true;
      $log.log('joinMeeting started.');

      if (!vm.meeting._id) {
        vm.infoBoxMessage = 'Nie można zapisać się na to spotkanie. Spróbuj za chwilę.';
      }

      meeting.joinMeeting().then(
        function() {
          vm.infoBoxMessage = 'Zapisałeś się na to spotkanie.';
        },
        function(results) {
          vm.infoBoxMessage = 'Nie można zapisać się na to spotkanie. Błąd: ' + angular.toJson(results) + '.';
        }
      );
    }
	}
})();
