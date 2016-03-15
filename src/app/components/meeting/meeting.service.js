(function() {
	'use strict';

	angular
	.module('meetingModule')
	.factory('Meeting', meeting);

	/** @ngInject */
	function meeting($log, api, tokenService) {
		var Meeting = function(meetingId) {
			this._id = meetingId;
			this.loading = false;
			this.data = {};
		};

		Meeting.prototype.getData = getData;
    Meeting.prototype.setData = setData;
    Meeting.prototype.saveMeeting = saveMeeting;
    Meeting.prototype.joinMeeting = joinMeeting;
    Meeting.prototype.leaveMeeting = leaveMeeting;
    Meeting.prototype.updateMeeting = updateMeeting;

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

    function setData(meetingObject) {
      var meeting = this;

      if (typeof meetingObject === 'undefined') {
        return false;
      }

      meeting.data = meetingObject;
      return true;
    }

    function saveMeeting() {
      var meeting = this;
      var meetingData = {
        token: tokenService.get()
      };

      angular.extend(meetingData, meeting.data);

      return api.createMeeting({method: 'POST', data: meetingData}).then(
        function (res) {
          return res;
        }
      );
    }

    function updateMeeting(newData) {
      var meetingData = {};

      if (typeof newData !== 'undefined') {
        angular.extend(meetingData, newData);
      }

      return api.updateMeeting(meetingData);
    }

    /**
    * @description
    *   joinMeeting function assigns current user to the meeting as a participant. It returns promise object.
    * @param meetingId
    *   it's an id of the meeting which the user wants to be assigned to
    */
    function joinMeeting(meetingId) {
      return api.joinMeeting({ _id: meetingId });
    }

    /**
    * @description
    *   leaveMeeting function is to unassign current user from with a given _id. It returns promise object.
    * @param meetingId
    *   it's an id of the meeting which the user wants to be unassigned from
    */
    function leaveMeeting(meetingId) {
      return api.leaveMeeting({ _id: meetingId });
    }

	}
})();
