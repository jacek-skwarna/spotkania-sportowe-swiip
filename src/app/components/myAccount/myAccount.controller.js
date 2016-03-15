(function() {
    'use strict';

    angular.module('myAccountModule')
    .controller('MyAccountController', MyAccountController);

    /** @ngInject */
    function MyAccountController($log, $q, logonService, User, $state, $timeout, Meeting) {
      var vm = this;
      var inProgress = false;

      vm.updateUser = updateUser;
      vm.currentUser = {};
      vm.userDetails = {
        info: {
          message: "",
          status: ""
        }
      };
      vm.organizedMeetings = [];
      vm.assignedMeetings = [];
      init();

      /////////////////

      /**
      * @description
      *   updateUser function call saveData method from User service to update user data on backend
      */
      function updateUser() {
        if (inProgress || !angular.isFunction(vm.currentUser.saveData)) {
          return;
        }

        inProgress = true;
        vm.currentUser.saveData().then(
          function() {
            inProgress = false;
            vm.userDetails.info.message = "User details have been updated.";
            vm.userDetails.info.status = "success";
            $timeout(function() {
              reloadState();
            }, 2000);
          },
          function(results) {
            inProgress = false;
            vm.userDetails.info.message = results;
            vm.userDetails.info.status = "alert";
          }
        );
      }

      /**
      * @description
      *   prepareUser function creates a new instance of User object based on given id and get it's data from api
      */
      function prepareUser(userId) {
        vm.currentUser = new User(userId);

        return $q(function(resolve, reject) {
          vm.currentUser.getData().then(
            function() {
              resolve();
            },
            function() {
              reject();
            }
          );
        });
      }

      /**
      * @description
      *   reloadState function reloads current state
      */
      function reloadState() {
        $state.transitionTo($state.current, {}, {
          reload: true,
          inherit: false,
          notify: true
        });
      }

      /**
      * @description
      *   prepareMeetings function loads the meetings data based on the given array of meetings ids and returns array of meetings
      * @param idsList
      *   array containing ids of meetings
      */
      function prepareMeetings(idsList) {
        return $q(loadMeetingsData);

        function loadMeetingsData(resolve, reject) {
          var idsListLength;
          var meetings = [];

          if (!angular.isArray(idsList)) {
            return reject(meetings);
          }

          idsListLength = idsList.length;

          for (var i = 0; i < idsListLength; i++) {
            var meeting = new Meeting(idsList[i]);
            meeting.getData();
            meetings.push(meeting);
          }

          $log.log('prepareMeetings, meetings: ' + angular.toJson(meetings));

          return resolve(meetings);
        }
      }

      /**
      * @description
      *   init function initializes all required models like currentUser, organizedMeetings and assignedMeetings
      */
      function init() {
        logonService.isLogged()
        .then(
          function(results) {
            // user _id is expected in results
            $log.log('zalogowany, results: ' + angular.toJson(results));
            // create a new user, get it's data and save it as a currentUser
            prepareUser(results).then(
              function() {
                $log.log('init prepareUser success, vm.currentUser.data.organized_meetings: ' + vm.currentUser.data.organized_meetings);
                prepareMeetings(vm.currentUser.data.organized_meetings).then(function(results) {
                  vm.organizedMeetings = results;
                });

                prepareMeetings(vm.currentUser.data.assigned_meetings).then(function(results) {
                  vm.assignedMeetings = results;
                });
              },
              function() {
                $log.log('No organized meetings.');
              }
            );
          },
          function() {
            // if user is not logged in then it will be redirected to home state
            $state.go('main.home');
          }
        );
      }
    }
})();
