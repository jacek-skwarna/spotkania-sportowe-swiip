(function() {
	'use strict';

	angular
	.module('meetingModule')
	.factory('Meeting', meeting);

	/** @ngInject */
	function meeting($log, api) {
		var Meeting = function(meetingId) {
			this._id = meetingId;
			this.loading = false;
			this.data = {};
		};

		Meeting.prototype.getData = getData;

		return Meeting;
		////////////////////

		function getData() {
			var meeting = this;

			meeting.loading = true;

			return api.meeting({method: 'GET', params: {_id: meeting._id}}).then(
				function (res) {
					meeting.data = res.results[0] || {};
					meeting.loading = false;
				}
			);
		}
	}
})();