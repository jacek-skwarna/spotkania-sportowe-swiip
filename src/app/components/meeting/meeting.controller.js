(function() {
	'use strict';

	angular
	.module('meetingModule')
	.controller('MeetingController', MeetingController);

	/** @ngInject */
	function MeetingController($window, $log, api, $state, $stateParams, NgMap, Meeting, User) {
		var vm = this;
		var _id = $stateParams._id || null;
		var meeting = new Meeting(_id);
		var meetingOwner = {};

		vm.meeting = {};
		vm.meetingOwner = {};

		meeting.getData().then(function() {
			vm.meeting = meeting.data;
			initMeetingOwner(vm.meeting.owner_id);
			showVenueOnMap(vm.meeting);
		});

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
				var lat = meeting.venue_coordinates.split(',').shift();
				var lng = meeting.venue_coordinates.split(',').pop();
				$log.log('lat: ' + lat + ', lng: ' + lng);
				var latlng = new $window.google.maps.LatLng(lat, lng);
				var venueMarker = new $window.google.maps.Marker();
				venueMarker.setPosition(latlng);
				venueMarker.setMap(map);
				map.setCenter(latlng);
			});
		}
	}
})();