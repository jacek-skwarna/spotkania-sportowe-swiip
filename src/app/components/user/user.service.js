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
    User.prototype.saveData = saveData;

		return User;
		////////////////////

		function getData() {
			var user = this;

			user.loading = true;

			return api.user({method: 'GET', params: {_id: user._id}}).then(
				function (results) {
					if (results.results) {
						user.data = results.results;
					}

					user.loading = false;
				}
			);
		}

    function saveData() {
      var user = this;

      user.loading = true;

      $log.log("saveData: " + angular.toJson(angular.extend({_id: user._id}, user.data)));

      return api.updateUser(angular.extend({_id: user._id}, user.data));
    }
	}
})();
