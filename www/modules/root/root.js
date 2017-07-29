(function () {
  'use strict';

  angular.module('Root', [])
    .config(function ($stateProvider) {
      $stateProvider
        .state('root1', {
          abstract: true,
          url: '/root1',
          views: {
            'main': {
              templateUrl: './modules/root/root1.html',
              controller: 'root1Controller',
              controllerAs: 'vm'
            }
          }
        })
        .state('root2', {
          abstract: true,
          url: '/root2',
          views: {
            'main': {
              templateUrl: './modules/root/root2.html',
              controller: 'root2Controller',
              controllerAs: 'vm'
            }
          }
        });
    })
})();
