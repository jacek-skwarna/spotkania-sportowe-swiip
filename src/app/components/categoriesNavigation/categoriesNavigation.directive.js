(function() {
  'use strict';

  angular
    .module('spotkaniaSportoweSwiip')
    .directive('categoriesNavigation', categoriesNavigation);

  /** @ngInject */
  function categoriesNavigation() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/categoriesNavigation/categoriesNavigation.html',
      controller: categoriesNavigationController,
      controllerAs: 'categoriesNavigationCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function categoriesNavigationController($log, categories) {
      var vm = this;

      vm.categories = [];
      vm.defaultLimit = 20;

      categories.getCategories()
      .then(function(data) {
        $log.log('data: ' + angular.toJson(data, true));
        vm.categories = data;
      });
    }
  }

})();
