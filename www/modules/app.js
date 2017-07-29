(function() {
  'use strict';

  angular.module('app', [
      'Core',
      'Directives',
      'Auth',
      'Root'
  ])
  .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('login');
  })
  .config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);

    if(AppSettings.env === 'prod') {
      $compileProvider.debugInfoEnabled(false);
    }
  })
  .config(function($logProvider) {
    if (AppSettings.env === 'prod') {
      $logProvider.debugEnabled(false);
    }
  })
  .config(function($ionicConfigProvider) {
     // This is to force all tabs position to be at the bottom
    $ionicConfigProvider.tabs.position('bottom');
  })
  // .config(function($locationProvider) {
  //   // use the HTML5 History API
  //   // Also known as remove the '#' from the URL
  //   $locationProvider.html5Mode({
  //       enabled: true,
  //       requireBase: false
  //   });
  // })
  // .config(function(translationHelperProvider) {
  //   // --- To use the below translation provider, add as param in the config's fn: translationHelperProvider
  //   // ---      The dependency used here is 'angular-translate'
  //   var translationSvc = translationHelperProvider.$get();

  //   $translateProvider.translations('en', translationSvc.getTranslationType('en'));
  //   $translateProvider.preferredLanguage('en');
  //   $translateProvider.useSanitizeValueStrategy('sanitize'); // Refer http://angular-translate.github.io/docs/#/guide/19_security for security on Angular-translate
  // })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
})()
