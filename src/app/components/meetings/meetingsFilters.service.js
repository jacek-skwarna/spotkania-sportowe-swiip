(function() {
    'use strict';

    angular
    .module('meetingsModule')
    .service('meetingsFilters', meetingsFilters);

    /** @ngInject */
    function meetingsFilters() {
      /*
        var createMeetingOptions = {
            meeting_date: {
                type: 'input'
            },
            gender: {
                type: 'select',
                values: [
                    {
                        value: '',
                        name: ''
                    },
                    {
                        value: 'm',
                        name: 'Mężczyzn'
                    },
                    {
                        value: 'f',
                        name: 'Kobiet'
                    }
                ]
            },
            level: {
                type: 'select',
                values: [
                    {
                        value: '',
                        name: ''
                    },
                    {
                        value: '1',
                        name: 'początkujący'
                    },
                    {
                        value: '2',
                        name: 'średniozaawansowany'
                    },
                    {
                        value: '3',
                        name: 'profesjonalista'
                    }
                ]
            }
        };

        this.meetingCreateFilters = function() {
            return options;
        };
      */
    }
})();
