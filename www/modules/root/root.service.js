(function() {
	'use strict';
	
	angular.module('Root')
		.service('rootService', rootService);

		rootService.$inject = ['commonService'];
		function rootService(commonService) {
			var service = this;

			/* ======================================== Var ==================================================== */
			service.misc = {
	        	
	        }

	        /* ======================================== Services =============================================== */
	        var cmnSvc = commonService;

	        /* ======================================== Public Methods ========================================= */

	        /* ======================================== Private Methods ======================================== */
	        function init() {
	        	
	        }

	        init();
		}

})();