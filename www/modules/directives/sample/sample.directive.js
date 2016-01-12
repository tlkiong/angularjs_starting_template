(function(){
	'use strict';
	
	angular.module('Directives')
		.directive('sample', sample);

		sample.$inject = ['sampleService'];
		function sample(sampleService){
			return {
				restrict: 'E',
				scope: {
					placeholder: "@",
					list: "=",
					property: "@"
				},
				templateUrl: 'modules/directives/sample/sample.directive.html',
				link: function(scope) {
					function init(){

					}

					init();
				}
			};
		}
})();