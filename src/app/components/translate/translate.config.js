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
      },
      MEETINGS_IN_CATEGORY_SEARCH: {
        HEADER_FILTERS: 'Co Cię interesuje?',
        HEADER_RESULTS: 'Lista spotkań'
      },
      REGISTER_USER: {
        LABELS: {
          EMAIL: "Email",
          PASSWORD: "Hasło",
          NICK: "Nick",
          PHONE: "Numer telefonu",
          GENDER: "Płeć"
        },
        BUTTONS: {
          SUBMIT: "Wyślij"
        }
      },
      MEETING: {
        ATTRIBUTES: {
          DATE: "Termin",
          VENUE: "Adres",
          MEMBERS: "Wolne miejsca",
          GENDER: "Spotkanie dla",
          LEVEL: "Poziom"
        },
        VALUES: {
          GENDER: {
            m: 'Mężczyzn',
            f: 'Kobiet'
          },
          LEVEL: {
            '1': 'Początkujący',
            '2': 'Średniozaawansowany',
            '3': 'Profesjonalista'
          }
        }
      },
      MEETING_CREATE: {
        HEADER: 'Utwórz spotkanie',
        SEARCH_BUTTON: 'Wyszukaj'
      },
      MEETING_EDIT: {
        HEADER: 'Edytuj spotkanie',
        SEARCH_BUTTON: 'Wyszukaj'
      },
      NOTIFICATIONS: {
        MAIN_HEADER: 'Powiadomienia',
        CREATE_MEETING_ANONYMOUS: {
          MESSAGE: 'Tylko zalogowani użytkownicy mogą tworzyć spotkania'
        },
        EDIT_MEETING_ANONYMOUS: {
          MESSAGE: 'Zaloguj się, aby edytować swoje spotkania.'
        }
      },
      CONTACT: {
        MAIN_HEADER: "Formularz kontaktowy",
        FIELDS: {
          NAME: {
            LABEL: "Imię"
          },
          MESSAGE: {
            LABEL: "Wiadomość"
          }
        },
        SUBMIT: "Wyślij"
      },
      MY_ACCOUNT: {
        MAIN_HEADER: "Moje konto",
        SECTIONS: {
          USER_DETAILS: {
            HEADER: "Dane użytkownika",
            FIELDS: {
              NICK: {
                LABEL: "Nick"
              },
              EMAIL: {
                LABEL: "Email"
              },
              PHONE: {
                LABEL: "Numer telefonu"
              },
              GENDER: {
                LABEL: "Płeć"
              },
              GENDER_MALE: {
                LABEL: "Mężczyzna"
              },
              GENDER_FEMALE: {
                LABEL: "Kobieta"
              }
            },
            SUBMIT: "Zapisz zmiany"
          },
          ORGANIZED_MEETINGS: {
            HEADER: "Zorganizowane spotkania"
          },
          ASSIGNED_MEETINGS: {
            HEADER: "Spotkania, do których się zapisałeś"
          }
        }
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
