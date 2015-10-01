(function() {
    angular.module("Homepage", [])
        .config(function($stateProvider) {
            $stateProvider
                .state('homepage', {
                    url: '/',
                    views: {
                        'main': {
                            templateUrl: './modules/homepage/homepage.html',
                            controller: 'homepageController',
                            controllerAs: 'vm'
                        }
                    }
                });
        })
})();
