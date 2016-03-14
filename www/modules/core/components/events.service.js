(function() {
	'use strict';
	
	angular.module('Core')
		.service('eventsService', eventsService);

		eventsService.$inject = ['$rootScope'];
		function eventsService($rootScope) {
			var service = this;

			/* ======================================== Events & Triggers ==================================================== */
	        var rootEventEnum = {
	            // For eg:
	            // 0: 'HEADER_STATE_MODIFIED'
	        };

	        service.event_stateModified = event_stateModified;
	        // service.on_headerStateModified = on_headerStateModified;

			/* ======================================== Var ==================================================== */
			service.misc = {
	        	
	        }

	        /* ======================================== Services =============================================== */

	        /* ======================================== Public Methods ========================================= */
	        //  ***** As an example of the listener with data being passed in ****
	        // function on_headerStateModified($scope, handler) {
	        //     $scope.$on(rootEventEnum[0], function(event, data) {
	        //         handler(data);
	        //     });
	        // }

	        // This function is to invoke the required listener (Key for rootEventNum)
	        function event_stateModified(arrIndex, data) {
	            $rootScope.$broadcast(rootEventEnum[arrIndex], data);
	        }

	        /* ======================================== Private Methods ======================================== */

		}
})();