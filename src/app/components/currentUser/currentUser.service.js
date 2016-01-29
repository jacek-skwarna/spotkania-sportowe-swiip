(function() {
	'use strict';

	angular
	.module('currentUserModule')
	.factory('CurrentUser', CurrentUser);

	/** @ngInject */
	function CurrentUser($log, $q, api, User, localStorage) {
		var CurrentUser = function(userId) {
			var token = localStorage.get('token') || null;
			var _id = null;
			var userData = {};

			this.loading = false;
			this.logged = false;
			this.getToken = getToken;

			init();

			function getToken() {
				return token;
			}

			function init() {
				// try authenticate user by token if token exists
				if (token) {
					api.currentuser({
						method: 'GET',
						headers: {
							'x-access-token': token
						}
					})
					.then(function(results) {
						$log.log('results: ' + angular.toJson(results));
					});
				}
			}
		};

		CurrentUser.prototype.getData = getData;
		CurrentUser.prototype.login = login;

		return CurrentUser;
		////////////////////

		function getData() {
			var user = this;

			user.loading = true;

			return api.user({method: 'GET', params: {_id: user._id}}).then(
				function (res) {
					if (res.results) {
						user.data = res.results;
					}
					
					user.loading = false;
				}
			);
		}

		function login(email, password) {
			var user = this;

			if (typeof email === 'undefined') {
				return;
			}
			if (typeof password === 'undefined') {
				return;
			}

			api.authenticate({method: 'POST', data: {email: email, password: password}})
			.then(function(results) {
				if (results.err) {
					$log.log('Authentication failed. Error: ' + JSON.stringify(results.err));
				} 

				if (results.results && results.results.data && results.results.data.token && results.results.data.user) {
					$log.log('User authenticated.');
					//$scope.user = data.results.data.user;
					//$scope.token = data.results.data.token;
		        	//sessionStorage.setItem("user", JSON.stringify($scope.user));
		        	//localStorage.setItem("token", JSON.stringify($scope.token));
				}

				$log.log('login status 200, results: ' + angular.toJson(results));
			})
			.catch(function(results) {
				$log.log('login failed, error: ' + angular.toJson(results));
			});			
		};






		/*
		function getCategories() {
			return $q(serveCategories);
		}

		function serveUserData(resolve, reject) {
			if (categoriesArray.length) {
				resolve(categoriesArray);
			} else {
				api.categories({method: 'GET'})
				.then(function(data) {
					categoriesArray = data.results;
					resolve(categoriesArray);
				})
				.catch(function() {
					reject(categoriesArray);
				});
			}
		}
		*/




	}
})();