(function() {
    'use strict';

    angular.module('translate', [])
    .config(function($translateProvider) {
      $translateProvider.translations('pl', {
        HOME_MAIN_HEADLINE: 'Na co masz ochotę?'
      })
      .translations('en', {
        HOME_MAIN_HEADLINE: 'What activity do you prefer?'
      });

      $translateProvider.preferredLanguage('pl');
    });
})();
