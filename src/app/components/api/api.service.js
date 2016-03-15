(function() {
	'use strict';

	angular
	.module('apiModule')
	.service('api', api);

	/** @ngInject */
	function api($log, $http, $q, tokenService) {
		var root = 'http://localhost:8080/';
		var endpoints = {
			categories: 'categories',
      createMeeting: 'protected/meeting/create',
      updateMeeting: 'protected/meeting/:meetingId',
      joinMeeting: 'protected/meeting/:meetingId/join',
      leaveMeeting: 'protected/meeting/:meetingId/leave',
      meetingProtected: 'protected/meeting',
			meeting: 'meeting',
			meetings: 'meetings',
			user: 'user',
      userProtected: 'protected/user/:userId',
			authenticate: 'user/authenticate',
			authenticateByToken: 'protected/user/authenticatebytoken',
			currentuser: 'protected/user',
			noendpoint: 'noendpoint'
		};
		var request = function(endpoint, configuration) {
			var config = {responseType: "json"};

			var extendedConfig = angular.isString(endpoint) ? {url: root + endpoint} : {url: root + endpoints.noendpoint};
			angular.extend(config, extendedConfig);
			if (typeof configuration !== 'undefined') {
				angular.extend(config, configuration);
			}

			$log.log('arguments.length: ' + arguments.length);
			$log.log('config: ' + angular.toJson(config, true));

			return $http(config).then(function (response) {
        $log.log('response: ' + angular.toJson(response));

				if (response.data.err || response.err) {
					$log.error('Error: ' + angular.toJson(response.data.err, true));
					return $q.reject(response.data.err);
				} else {
					return response.data;
				}
			}, function(response) {
				$log.error('Api request error: ' + angular.toJson(response, true));
				return $q.reject(response);
			});
		};

		this.categories = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.categories) : request(endpoints.categories, configuration);
		};

		this.meetings = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.meetings) : request(endpoints.meetings, configuration);
		};

    // Meeting
		this.meeting = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.meeting) : request(endpoints.meeting, configuration);
		};

    this.updateMeeting = function(configuration) {
      var conf = {
        method: 'PUT',
        headers: { 'x-access-token': tokenService.get() }
      };
      var endpoint = endpoints.updateMeeting;

      if (typeof configuration !== 'undefined' && typeof configuration._id !== 'undefined') {
        endpoint = endpoint.replace(':meetingId', configuration._id);
        delete configuration._id;
        angular.extend(conf, { data: configuration });
      }

      $log.log('api.updateMeeting, conf: ' + angular.toJson(conf));

      return request(endpoint, conf);
    };

    this.joinMeeting = function(configuration) {
      var conf = {
        method: 'PUT',
        headers: { 'x-access-token': tokenService.get() }
      };
      var endpoint = endpoints.joinMeeting;

      if (typeof configuration !== 'undefined' && typeof configuration._id !== 'undefined') {
        endpoint = endpoint.replace(':meetingId', configuration._id);
        delete configuration._id;
        angular.extend(conf, { data: configuration });
      }

      $log.log('api.joinMeeting, conf: ' + angular.toJson(conf));

      return request(endpoint, conf);
    };

    this.leaveMeeting = function(configuration) {
      var conf = {
        method: 'PUT',
        headers: { 'x-access-token': tokenService.get() }
      };
      var endpoint = endpoints.leaveMeeting;

      if (typeof configuration !== 'undefined' && typeof configuration._id !== 'undefined') {
        endpoint = endpoint.replace(':meetingId', configuration._id);
        delete configuration._id;
        angular.extend(conf, { data: configuration });
      }

      $log.log('api.leaveMeeting, conf: ' + angular.toJson(conf));

      return request(endpoint, conf);
    };

    this.meetingProtected = function(configuration) {
      var conf = {};

      angular.extend(conf, { headers: { 'x-access-token': tokenService.get() } });

      if (typeof configuration !== 'undefined') {
        angular.extend(conf, configuration);
      }

      $log.log('meetingProtected, conf: ' + angular.toJson(conf));

      return request(endpoints.meetingProtected, conf);
    };

    this.createMeeting = function(configuration) {
      return typeof configuration === 'undefined' ? request(endpoints.meetingProtected) : request(endpoints.meetingProtected, configuration);
    };

		this.user = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.user) : request(endpoints.user, configuration);
		};

		this.authenticate = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.authenticate) : request(endpoints.authenticate, configuration);
		};

		this.authenticateByToken = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.authenticateByToken) : request(endpoints.authenticateByToken, configuration);
		};

		this.currentuser = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.currentuser) : request(endpoints.currentuser, configuration);
		};

		this.login = function(configuration) {
			/*
			expected configuration object:
			{
				email: emailString,
				password: passwordString
			}
			*/
			var config = {method: "POST"};

			if (typeof configuration !== 'undefined' && configuration.email && configuration.password) {
				angular.extend(config, {data: {email: configuration.email, password: configuration.password}});
				return request(endpoints.authenticate, config);
			} else {
				return false;
			}
		};

    this.updateUser = function(configuration) {
      $log.log("updateUser: " + angular.toJson(configuration));
      var conf = {
        method: 'PUT',
        headers: { 'x-access-token': tokenService.get() }
      };
      var endpoint = endpoints.userProtected;

      if (typeof configuration !== 'undefined' && typeof configuration._id !== 'undefined') {
        endpoint = endpoint.replace(':userId', configuration._id);
        delete configuration._id;
        angular.extend(conf, { data: configuration });
      }

      $log.log('api.updateUser, conf: ' + angular.toJson(conf));

      return request(endpoint, conf);
    };
	}
})();
