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
    vm.infoBoxMessage = {
      status: '',
      message: ''
    };

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

    function clearInfoBoxMessage() {
      vm.infoBoxMessage.status = '';
      vm.infoBoxMessage.message = '';
    }

    function joinMeeting() {
      clearInfoBoxMessage();

      if (inProgress) {
        $log.log('joinMeeting in progress.');
        vm.infoBoxMessage.message = 'Zapisywanie w toku.';
        vm.infoBoxMessage.status = 'success';
        return;
      }

      inProgress = true;
      $log.log('joinMeeting started.');

      if (!vm.meeting._id || !vm.currentUserId) {
        vm.infoBoxMessage.message = 'Nie można zapisać się na to spotkanie. Spróbuj za chwilę.';
        vm.infoBoxMessage.status = 'alert';
        inProgress = false;
        return;
      }

      meeting.joinMeeting(vm.meeting._id).then(
        function() {
          vm.infoBoxMessage.message = 'Zapisałeś się na to spotkanie.';
          vm.infoBoxMessage.status = 'success';
          inProgress = false;
          init();
        },
        function(results) {
          vm.infoBoxMessage.message = 'Nie można zapisać się na to spotkanie. Błąd: ' + angular.toJson(results) + '.';
          vm.infoBoxMessage.status = 'alert';
          inProgress = false;
        }
      );
    }

    function leaveMeeting() {
      clearInfoBoxMessage();

      if (inProgress) {
        $log.log('leaveMeeting in progress.');
        vm.infoBoxMessage = 'Wypisywanie w toku.';
        vm.infoBoxMessage.status = 'success';
        return;
      }

      inProgress = true;
      $log.log('leaveMeeting started.');

      if (!vm.meeting._id || !vm.currentUserId || vm.meeting.assigned_users_ids.indexOf(vm.currentUserId) < 0) {
        vm.infoBoxMessage.message = 'Nie można wypisać się ze spotkania.';
        vm.infoBoxMessage.status = 'alert';
        inProgress = false;
        return;
      }

      meeting.leaveMeeting(vm.meeting._id).then(
        function() {
          vm.infoBoxMessage.message = 'Wypisałeś się ze spotkania.';
          vm.infoBoxMessage.status = 'success';
          inProgress = false;
          init();
        },
        function(results) {
          vm.infoBoxMessage.message = 'Nie można wypisać się ze spotkania. Błąd: ' + angular.toJson(results) + '.';
          vm.infoBoxMessage.status = 'alert';
          inProgress = false;
        }
      );
    }

    function isAssignBoxVisible () {
      if (!vm.currentUserId || isEditBoxVisible()) {
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
