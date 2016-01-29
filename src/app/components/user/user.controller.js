(function() {
  'use strict';

  angular
    .module('userModule')
    .controller('UserController', UserController);

  /** @ngInject */
  function UserController() {
    var vm = this;

    vm.t = 10;
  }
})();