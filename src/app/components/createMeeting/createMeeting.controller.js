(function() {
    'use strict';

    angular
    .module('createMeetingModule')
    .controller('CreateMeetingController', CreateMeetingController);

    /** @ngInject */
    function CreateMeetingController($q, $window, $log, api, $state, NgMap, Meeting, categories) {
      var vm = this;
      var meeting = {};

      vm.clearForm = clearForm;
      vm.saveMeeting = saveMeeting;
      vm.getCoordinates = getCoordinates;
      vm.categories = [];
      vm.infoBoxMessage = {
        message: '',
        status: ''
      };
      vm.meetingModel = {};

      categories.getCategories().then(
        function(results) {
          vm.clearForm();
          vm.categories = results;
          vm.meetingModel.category = vm.categories[0].url_suffix;
        }
      );

      //////////////////////

      function saveMeeting(meetingObject) {
        return $q(function(resolve, reject) {
          if (typeof meetingObject === 'undefined') {
            vm.infoBoxMessage.message = 'Spotkanie nie zostało utworzone. Wypełnij cały formularz.';
            vm.infoBoxMessage.status = 'alert';
            return reject('Spotkanie nie zostało utworzone. Wypełnij cały formularz.');
          }

          meeting = new Meeting();

          meeting.setData(vm.meetingModel);
          meeting.saveMeeting().then(
            function(results) {
              $log.log('Spotkanie utworzone. Results: ' + angular.toJson(results));
              vm.infoBoxMessage.message = 'Spotkanie utworzone.';
              vm.infoBoxMessage.status = 'success';
              vm.clearForm();
              return resolve(results);
            },
            function(results) {
              $log.log('Spotkanie nie zostało utworzone. Results: ' + angular.toJson(results));
              vm.infoBoxMessage.message = 'Spotkanie nie zostało utworzone.';
              vm.infoBoxMessage.status = 'alert';
              return reject(results);
            }
          );
        });
      }

      // function responsible for displaying map and inserting marker on the venue location
      function getCoordinates(venue) {
        return $q(function(resolve, reject) {
          if (typeof venue === 'undefined') {
            return reject('Brak danych adresowych.');
          }

          NgMap.getMap().then(function(map) {


            geocodeAddress(venue, map)
            .then(
              function(results) {
                $log.log('coordinates: ' + angular.toJson(results));
                vm.meetingModel.venue_coordinates = results;
              },
              function(results) {
                $log.log(angular.toJson(results));
              }
            );
          });
        });
      }

      function geocodeAddress(venue, resultsMap) {
        return $q(function(resolve, reject) {
          var geocoder = new $window.google.maps.Geocoder();
          var address = venue;

          geocoder.geocode({'address': address}, function(results, status) {
            if (status === $window.google.maps.GeocoderStatus.OK) {
              resultsMap.setCenter(results[0].geometry.location);
              var marker = new $window.google.maps.Marker();
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

      function clearForm() {
        vm.meetingModel = {
          category: '',
          meeting_date: Date.now(),
          members_required: 1,
          gender: 'm',
          venue: null,
          venue_coordinates: null,
          level: 1
        };
      }
    }
})();
