(function() {
  'use strict';

  angular
    .module('spotkaniaSportoweSwiip')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
