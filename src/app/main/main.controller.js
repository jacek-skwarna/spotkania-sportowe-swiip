(function() {
  'use strict';

  angular
    .module('spotkaniaSportoweSwiip')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, $state, CurrentUser) {
  	var vm = this;

  	vm.mainNavigation = [
		{
			name: 'Start',
			state: 'main.home'
		},
		{
			name: 'Kategorie',
			state: 'main.categories'
		},
		{
			name: 'Kontakt',
			state: 'main.contact'
		},
		{
			name: 'Regulamin',
			state: 'main.terms'
		},
		{
			name: 'Moje konto',
			state: 'main.user'
		}
	];

	vm.currentUser = new CurrentUser();

	vm.provideEmail = false;
	vm.providePassword = false;
	vm.login = function() {
		$log.log('w main.login, vm.provideEmail: ' + vm.provideEmail + ', vm.providePassword: ' + vm.providePassword);
		vm.currentUser.login(vm.provideEmail, vm.providePassword);
	};

	// try authenticate user by token
	//vm.currentUser.authenticateByToken();
  }
})();