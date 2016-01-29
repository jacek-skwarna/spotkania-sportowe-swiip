(function() {
	'use strict';

	angular
	.module('userModule')
	.factory('User', user);

	/** @ngInject */
	function user($log, api) {
		var User = function(userId) {
			this._id = userId || null;
			this.loading = false;
			this.data = {};
		};

		User.prototype.getData = getData;

		return User;
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
	}
})();