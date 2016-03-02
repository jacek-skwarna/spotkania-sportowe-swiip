(function() {
	'use strict';

	angular
	.module('meetingModule')
	.controller('MeetingController', MeetingController);

	/** @ngInject */
	function MeetingController($q, $window, $log, api, $state, $stateParams, NgMap, Meeting, User, logonService) {
		var vm = this;
		var _id = $stateParams._id || null;
		var meeting = new Meeting(_id);
		var meetingOwner = {};
    var inProgress = false;

    vm.joinMeeting = joinMeeting;
    vm.leaveMeeting = leaveMeeting;
		vm.meeting = {};
		vm.meetingOwner = {};
    vm.infoBoxMessage = '';
    vm.currentUserId = null;
    vm.isAssignBoxVisible = isAssignBoxVisible;
    vm.isUnassignBoxVisible = isUnassignBoxVisible;
    vm.isEditBoxVisible = isEditBoxVisible;

    init();

    function init () {

      meeting.getData().then(function() {
        vm.meeting = meeting.data;
        initMeetingOwner(vm.meeting.owner_id);
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
    }


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

      if (!vm.meeting._id || !vm.currentUserId) {
        vm.infoBoxMessage = 'Nie można zapisać się na to spotkanie. Spróbuj za chwilę.';
        inProgress = false;
        return;
      }

      meeting.joinMeeting(vm.meeting._id).then(
        function() {
          vm.infoBoxMessage = 'Zapisałeś się na to spotkanie.';
          inProgress = false;
          init();
        },
        function(results) {
          vm.infoBoxMessage = 'Nie można zapisać się na to spotkanie. Błąd: ' + angular.toJson(results) + '.';
          inProgress = false;
        }
      );
    }

    function leaveMeeting() {
      vm.infoBoxMessage = '';

      if (inProgress) {
        $log.log('leaveMeeting in progress.');
        vm.infoBoxMessage = 'Wypisywanie w toku.';
        return;
      }

      inProgress = true;
      $log.log('leaveMeeting started.');

      if (!vm.meeting._id || !vm.currentUserId || vm.meeting.assigned_users_ids.indexOf(vm.currentUserId) < 0) {
        vm.infoBoxMessage = 'Nie można wypisać się ze spotkania.';
        inProgress = false;
        return;
      }

      meeting.leaveMeeting(vm.currentUserId, vm.meeting._id).then(
        function() {
          vm.infoBoxMessage = 'Wypisałeś się ze spotkania.';
          inProgress = false;
          init();
        },
        function(results) {
          vm.infoBoxMessage = 'Nie można wypisać się ze spotkania. Błąd: ' + angular.toJson(results) + '.';
          inProgress = false;
        }
      );
    }

    function isAssignBoxVisible () {
      if (!vm.currentUserId) {
        return false;
      }

      if (vm.meeting.assigned_users_ids.indexOf(vm.currentUserId) < 0) {
        if (vm.meeting.members_required > vm.meeting.assigned_users_ids.length) {
          return true;
        }
      }

      return false;
    }

    function isUnassignBoxVisible () {
      if (!vm.currentUserId) {
        return false;
      }

      if (vm.meeting.assigned_users_ids.indexOf(vm.currentUserId) >= 0) {
          return true;
      }

      return false;
    }

    function isEditBoxVisible () {
      return vm.currentUserId && vm.currentUserId === vm.meeting.owner_id;
    }

	}
})();
