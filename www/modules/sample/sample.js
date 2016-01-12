(function () {
    'use strict';
    
	angular.module("Sample", [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('sample', {
                    url: '/',
                    views: {
                        'main': {
                            templateUrl: './modules/sample/sample.html',
                            controller: 'sampleController',
                            controllerAs: 'vm'
                        }
                    }
                });
		})
})();