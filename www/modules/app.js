(function() {
    'use strict';

    angular.module('app', [
            'Core',
            'Directives'
        ])
        .config(function($stateProvider, $urlRouterProvider, $compileProvider) {
            $urlRouterProvider.otherwise('/');
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
        }).run(function(/* $state */$rootScope) {
        	$rootScope.$on('$stateChangeStart', function(evnt, toState, toParams, fromState, fromParams) {
		        // If you want to stop the state change event, use:
		        // 		evnt.preventDefault();
		        // If you want to change state:
		        // 		evnt.preventDefault();
		        // 		$state.go('statename');		<= Do remember to add $state as dependency on 'run' as shown above
		    });
        }
    

})()
