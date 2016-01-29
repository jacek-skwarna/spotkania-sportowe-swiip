(function() {
	'use strict';

	angular
	.module('storageModule')
	.service('localStorage', localStorage);

	/** @ngInject */
	function localStorage($window) {
		this.get = get;
		this.set = set;

		/**
		* @param itemName - it's a key used to store required value inside a localStorage
		* @description
		*   function returns a value stored under the given key (itemName param) or null when given key does not exist in localStorage.
		*   If localStorage is not supported, function returns 'false'.
		*/
		function get(itemName) {
			return typeof localStorage !== 'undefined' ? angular.fromJson($window.localStorage.getItem(itemName)) : false;
		}

		/**
		* @param itemName - it's a key that will be used to store given value (itemValue parameter) inside a localStorage
		* @param itemValue - it's a value that will be stored inside a localStorage under the given key (itemName param)
		* @description
		*   function save the given value (itemValue parameter) in localStorage under the given key (itemName param) and 
		*   returns 1 when value is saved. If localStorage is not supported, function returns 'false'.
		*/
		function set(itemName, itemValue) {
			if (typeof localStorage === 'undefined') {
				return false;
			}

			localStorage.setItem(itemName, angular.toJson(itemValue));
			return 1;
		}
	}
})();