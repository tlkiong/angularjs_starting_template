(function() {
    'use strict';

    angular.module('app', [
            'Core',
            'Directives'
        ])
        .config(function($locationProvider, $stateProvider, $urlRouterProvider, $compileProvider) {
            $urlRouterProvider.otherwise('/');
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);

            // use the HTML5 History API
            // Also known as remove the '#' from the URL
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            /* ==================================== Translation ==================================== */
            // --- To use the below translation provider, add as param in the config's fn: translationHelperProvider
            // ---      The dependency used here is 'angular-translate'
            // var translationSvc = translationHelperProvider.$get();
            
            // $translateProvider.translations('en', translationSvc.getTranslationType('en'));
            // $translateProvider.preferredLanguage('en');
            // $translateProvider.useSanitizeValueStrategy('sanitize'); // Refer http://angular-translate.github.io/docs/#/guide/19_security for security on Angular-translate
            /* ==================================== End: Translation ==================================== */

        }).run(function(/* $state */$rootScope) {
        	$rootScope.$on('$stateChangeStart', function(evnt, toState, toParams, fromState, fromParams) {
		        // If you want to stop the state change event, use:
		        // 		evnt.preventDefault();
		        // If you want to change state:
		        // 		evnt.preventDefault();
		        // 		$state.go('statename');		<= Do remember to add $state as dependency on 'run' as shown above
		    });
        });
})()
