(function () {
  'use strict';
    
  angular.module('Auth', [])
    .config(function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          views: {
            'main': {
              templateUrl: './modules/auth/login.html',
              controller: 'authController',
              controllerAs: 'vm'
            }
          }
        });
    })
})();