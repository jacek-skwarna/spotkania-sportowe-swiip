(function() {
	'use strict';

	angular
	.module('meetingsModule')
	.controller('MeetingsController', MeetingsController);

	/** @ngInject */
	function MeetingsController($log, $timeout, api, $state, $stateParams, categories) {
	var vm = this;
  var searchInProgress = null;
  var venueUpdateTimeout = null;

	vm.meetingsFilters = {
		gender: {
			type: 'select',
			values: [
				{
					value: '',
					name: 'Wszystkich'
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
		},
    venue: {
      type: 'text'
    }
	};

	vm.models = {
		gender: vm.meetingsFilters.gender.values[0],
		level: vm.meetingsFilters.level.values[0],
    venue: ''
	};

	vm.categoryModel = {};
	vm.categories = [];

	vm.meetings = [];
  vm.countAll = 0;//number of all meetings that match selected filters, this value should be returned together with the meetings array
  vm.countPages = 0;//number of pages computed using $stateParams.limit and vm.countAll
  vm.pagination = [];
  vm.currentOffset = parseInt($stateParams.offset);

  vm.venueUpdated = venueUpdated;
  vm.categoryUpdated = categoryUpdated;
  vm.showMeetingDetail = showMeetingDetail;
  vm.filtersUpdated = filtersUpdated;

	setModelsByQueryParameters();

  categories.getCategories()
  .then(function(data) {
    var selectedCategory = $stateParams.category,
      selectedCategoryArray = [];
    function filterCategory(item) {
      return item.url_suffix === selectedCategory;
    }

    $log.log('$stateParams.category: ' + $stateParams.category);
    selectedCategoryArray = data.filter(filterCategory);
    vm.categories = data;

    if (selectedCategoryArray.length) {
      vm.categoryModel = selectedCategoryArray[0];
    }

    getMeetings(prepareParamsForMeetings());
  });

	function setModelsByQueryParameters() {
		/*
		set models based on current url
		*/
		var keys = Object.keys($stateParams),
			paramsLength = keys.length,
			filteredItems = [];// only for type 'select'

		for (var i = 0; i < paramsLength; i++) {
      if (typeof vm.meetingsFilters[keys[i]] === 'undefined' || typeof vm.models[keys[i]] === 'undefined') {
        continue;
      }

			filteredItems = [];

      if (vm.meetingsFilters[keys[i]].type === 'select') {
        filteredItems = vm.meetingsFilters[keys[i]].values.filter(function(item) {
          if (item.value === $stateParams[keys[i]]) {
            return true;
          }
        });
      }

      if (keys[i] === 'venue' && angular.isString($stateParams[keys[i]])) {
        vm.models[keys[i]] = $stateParams[keys[i]].length >= 1 ? $stateParams[keys[i]] : '';
        if ($stateParams[keys[i]].length < 3) {
          $state.go("main.meetingsInCategorySearch.list", {venue: ''});
        }
      }

			if (filteredItems.length) {
				vm.models[keys[i]] = filteredItems[0];
			}
		}
	}

	function prepareParamsForMeetings() {
		var keys = Object.keys($stateParams),
			paramsLength = keys.length;

		var config = {
			method: 'GET',
			params: {}
		};

		for (var i = 0; i < paramsLength; i++) {
			config.params[keys[i]] = $stateParams[keys[i]];
		}

		return config;
	}

	function getMeetings(configuration) {
		return api.meetings(configuration)
		.then(function(data) {
			vm.meetings = data.results;
      vm.countAll = data.count_all;
      if (!$stateParams.limit || !vm.countAll) {
        return;
      }
      vm.countPages = Math.ceil(vm.countAll/$stateParams.limit);
      for (var i = 0; i < vm.countPages; i++) {
        vm.pagination.push({
          offset: i * $stateParams.limit,
          number: i + 1
        });
      }
		});
	}

	function filtersUpdated(filterName) {
		var filter = {};
		filter[filterName] = vm.models[filterName].value;
    $log.log('filtersUpdated, filter: ' + angular.toJson(filter));
		$state.go("main.meetingsInCategorySearch.list", filter);
	}

  /**
  * @description
  *   venueUpdated function is responsible for updating vm.meetings model based on provied venue. Function should
  *   execute only if given @venue param is longer than 3 characters and if search is not in progress already.
  * @param venue
  *   it's a string provided by user, it should describe a meeting location
  */
  function venueUpdated(venue) {
    var currentTime = Date.now();
    var configuration = {};

    $log.log('venueUpdated, venue: ' + venue);

    if (searchInProgress || !angular.isString(venue)) {
      $log.log('venueUpdated if');
      return;
    }

    $timeout.cancel(venueUpdateTimeout);

    // prepare configuration
    configuration = prepareParamsForMeetings();

    if (venue.length < 3) {
      venueUpdateTimeout = $timeout(function() {
        $log.log('venue.length < 3');
        delete configuration.params.venue;
        $state.go("main.meetingsInCategorySearch.list", {venue: ''});
      }, 1500);
      return;
    } else {
      angular.extend(configuration.params, {venue: venue});
    }

    $log.log('venueUpdated, configuration: ' + angular.toJson(configuration));

    venueUpdateTimeout = $timeout(function() {
      $log.log('timeout');
      searchInProgress = currentTime;
      $state.go("main.meetingsInCategorySearch.list", {venue: venue});
    }, 1500);
  }

  function categoryUpdated() {
		$state.go("main.meetingsInCategorySearch.list", {category: vm.categoryModel.url_suffix});
	}

	function showMeetingDetail(meetingId) {
		$state.go("main.meetingsInCategorySearch.meetingDetail", {meetingid: meetingId});
	}
	}
})();
