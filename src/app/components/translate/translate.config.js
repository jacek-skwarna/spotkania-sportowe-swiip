(function() {
    'use strict';

    var plTranslations = {
      HOME_MAIN_HEADLINE: 'Na co masz ochotę?',
      MEETING_FOR: {
        "m": "Spotkanie dla mężczyzn",
        "f": "Spotkanie dla kobiet",
        "": "Spotkanie dla wszystkich"
      },
      MEETINGS_FILTERS: {
        VENUE: "Miejsce spotkania",
        CATEGORY: "Wybierz kategorię",
        GENDER: "Spotkanie dla",
        LEVEL: "Poziom"
      }
    };

    var globalTranslations = {
      GENDER_CLASS: {
        "m": "fi-male",
        "f": "fi-female",
        "": "fi-male-female"
      }
    };

    angular.extend(plTranslations, globalTranslations);

    angular.module('translate')
    .config(function ($translateProvider) {
      $translateProvider.translations('pl', plTranslations);
      $translateProvider.preferredLanguage('pl');
      // Enable escaping of HTML
      $translateProvider.useSanitizeValueStrategy('escape');
    });
})();
