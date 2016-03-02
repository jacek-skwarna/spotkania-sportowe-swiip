(function() {
	'use strict';

	angular
	.module('meetingsModule')
	.controller('MeetingsController', MeetingsController);

	/** @ngInject */
	function MeetingsController($log, api, $state, $stateParams, categories) {
	var vm = this;

	vm.meetingsFilters = {
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

	vm.models = {
		gender: vm.meetingsFilters.gender.values[0],
		level: vm.meetingsFilters.level.values[0]
	};

	vm.categoryModel = {};
	vm.categories = [];

	vm.defaultLimit = 20;
	vm.meetings = [];

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
			filteredItems = [];

		for (var i = 0; i < paramsLength; i++) {
			filteredItems = [];

			if (typeof vm.meetingsFilters[keys[i]] !== 'undefined' && typeof vm.models[keys[i]] !== 'undefined') {
				filteredItems = vm.meetingsFilters[keys[i]].values.filter(function(item) {
					if (item.value === $stateParams[keys[i]]) {
						return true;
					}
				});
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
		api.meetings(configuration)
		.then(function(data) {
			vm.meetings = data.results;
		});
	}

	vm.filtersUpdated = function(filterName) {
		var filter = {};
		filter[filterName] = vm.models[filterName].value;
		$state.go("main.meetingsInCategorySearch.list", filter);
	};

	vm.categoryUpdated = function() {
		$state.go("main.meetingsInCategorySearch.list", {category: vm.categoryModel.url_suffix});
	};

	vm.showMeetingDetail = function(meetingId) {
		$state.go("main.meetingsInCategorySearch.meetingDetail", {meetingid: meetingId});
	};


	/*
	api.categories({method: 'GET'})
	.then(function(data) {
		var selectedCategory = $stateParams.category,
			selectedCategoryArray = [];
		function filterCategory(item) {
			return item.url_suffix === selectedCategory;
		}

		if (data && data.results) {
			$log.log('$stateParams.category: ' + $stateParams.category);
			selectedCategoryArray = data.results.filter(filterCategory);
			vm.categories = data.results;
		}

		if (selectedCategoryArray.length) {
			vm.categoryModel = selectedCategoryArray[0];
		}
	})
	.then(function() {
		getMeetings(prepareParamsForMeetings());
	});
	*/
	}
})();
