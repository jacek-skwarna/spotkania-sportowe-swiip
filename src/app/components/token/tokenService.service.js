(function() {
	'use strict';

	angular
	.module('tokenModule')
	.service('tokenService', tokenService);

	/** @ngInject */
	function tokenService(localStorage) {
    var self = this;

		self.get = get;
    self.set = set;
    self.remove = remove;

    ///////////////
    function get() {
      return localStorage.get('token');
    }

		function set(token) {
			if (typeof token === 'undefined') {
				return false;
			}

			return localStorage.set('token', token);
		}

		function remove() {
			localStorage.remove('token');
		}
	}
})();
