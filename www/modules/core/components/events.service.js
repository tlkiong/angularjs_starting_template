(function() {
  'use strict';

  angular.module('Core')
    .service('eventsService', eventsService);

    eventsService.$inject = ['$rootScope'];
    function eventsService($rootScope) {
      var service = this;
      service.event_stateModified = event_stateModified;
      service.on_compDataModified = on_compDataModified;
      service.on_lokiIsLoaded = on_lokiIsLoaded

      /* ======================================== Var ==================================================== */
      service.misc = {};

      var rootEventEnum = {
        0: 'COMP_DATA_MODIFIED',
        1: 'LOKI_IS_LOADED'
      };

      /* ======================================== Services =============================================== */

      /* ======================================== Public Methods ========================================= */
      //  ***** As an example of the listener with data being passed in ****
      // function on_headerStateModified($scope, handler) {
      //     $scope.$on(rootEventEnum[0], function(event, data) {
      //         handler(data);
      //     });
      // }

      function on_lokiIsLoaded($scope, handler) {
        $scope.$on(rootEventEnum[1], function(event) {
          handler();
        });
      }

      function on_compDataModified($scope, handler) {
        $scope.$on(rootEventEnum[0], function(event, data) {
          handler(data);
        });
      }

      // This function is to invoke the required listener (Key for rootEventNum)
      function event_stateModified(arrIndex, data) {
        $rootScope.$broadcast(rootEventEnum[arrIndex], data);
      }

      /* ======================================== Private Methods ======================================== */

    }
})();
