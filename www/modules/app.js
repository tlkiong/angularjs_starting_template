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
  // .config(function($translateProvider) {
  //   // ---      The dependency used here is 'angular-translate'
  //   // You need to add 'pascalprecht.translate' as dependency in 'app' module
  //   $translateProvider.preferredLanguage('default');
  //   $translateProvider.useSanitizeValueStrategy('sanitize'); // Refer http://angular-translate.github.io/docs/#/guide/19_security for security on Angular-translate
  //   $translateProvider.useLoader('angularTranslateCustomLoader');
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
