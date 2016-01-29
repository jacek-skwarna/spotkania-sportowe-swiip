(function() {
	'use strict';

	angular
	.module('apiModule')
	.service('api', api);

	/** @ngInject */
	function api($log, $http) {
		var root = 'http://localhost:8080/';
		var endpoints = {
			categories: 'categories',
			meeting: 'meeting',
			meetings: 'meetings',
			user: 'user',
			authenticate: 'user/authenticate',
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
				if (response.data.err) {
					$log.error('Error: ' + angular.toJson(response.data.err, true));
					return false;
				} else {
					return response.data;
				}
			}, function(response) {
				$log.error('Api request error: ' + angular.toJson(response, true));
				return false;
			});
		};

		this.categories = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.categories) : request(endpoints.categories, configuration);
		};

		this.meetings = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.meetings) : request(endpoints.meetings, configuration);
		};

		this.meeting = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.meeting) : request(endpoints.meeting, configuration);
		};

		this.user = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.user) : request(endpoints.user, configuration);
		};

		this.authenticate = function(configuration) {
			return typeof configuration === 'undefined' ? request(endpoints.authenticate) : request(endpoints.authenticate, configuration);
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
	}
})();