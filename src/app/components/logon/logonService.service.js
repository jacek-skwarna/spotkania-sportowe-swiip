(function() {
	'use strict';

	angular
	.module('logonModule')
	.service('logonService', LogonService);

	/** @ngInject */
	function LogonService($log, tokenService, $q, api, $state, $stateParams) {
    var currentUserId = null;
    var self = this;
    var lastAuthenticationTime = Date.now();

    //console.log('lastAuthenticationTime: ' + lastAuthenticationTime);

		self.isLogged = isLogged;
		self.login = login;
    self.logout = logout;
    self.getCurrentUserId = getCurrentUserId;

		///////////////////

    function isLogged() {
      $log.log('lastAuthenticationTime: ' + lastAuthenticationTime);
      return $q(checkUser);
    }

		function checkUser(resolve, reject) {
			var token = tokenService.get();

			if (!token) {
				return reject(false);
			}

			$log.log('token: ' + token + ', typeof token: ' + typeof token);

      // check token only if it's older than 5 minutes
      $log.log('Date.now() - lastAuthenticationTime = ' + (Date.now() - lastAuthenticationTime));

      if (((Date.now() - lastAuthenticationTime) < 300000) && currentUserId) {
        $log.log('w if');
        return resolve(currentUserId);
      }


			api.authenticateByToken(
				{
					method: 'POST',
					data: {
						token: token
					}
				}
			)
			.then(function(results) {
				if (results.results.error) {
					tokenService.remove();
					return reject(results.results.error);
				}

				if (results.results._id) {
          lastAuthenticationTime = Date.now();
          currentUserId = results.results._id;

					return resolve(results.results._id);
				}

        return reject('User id not available.');
			},
			function(results) {
				reject(results);
			});
		}

    function login(email, pass) {
      email = email || false;
      pass = pass || false;

      return $q(function(resolve, reject) {
        if (!email || !pass) {
          return reject("Login failed. Email and/or password not provided.");
        }

        api.authenticate({
          method: "POST",
          data: {email: email, password: pass}
        }).
        then(
          function (results) {
            var user = {},
                token = '';

            if (results.results && results.results.token && results.results.user) {
              $log.log('User authenticated.');
              user = results.results.user;
              token = results.results.token;

              // save token in local storage
              tokenService.set(token);

              $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
              });

              $log.log('zalogowałeś się');
              currentUserId = user._id;

              return resolve(user._id);
            } else {
              $log.log('Authentication problem. No user data in response.');
              return reject('Authentication problem. No user data in response.');
            }
          },
          function(results) {
            $log.log('Authentication failed. Error: ' + angular.toJson(results.err));
            return reject('Authentication failed. Error: ' + angular.toJson(results.err));
          }
        );
      });
    }

    function logout() {
      tokenService.remove();
      $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
      });
    }

    function getCurrentUserId() {
      return currentUserId;
    }
	}
})();
