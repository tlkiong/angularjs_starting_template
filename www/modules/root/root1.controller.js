(function() {
  'use strict';

  angular.module('Root')
    .controller('root1Controller', root1Controller);

  root1Controller.$inject = ['firebaseService', '$timeout', 'commonService', 'rootService'];

  function root1Controller(firebaseService, $timeout, commonService, rootService) {
    var vm = this;
    vm.goToPage = goToPage;

    /* ======================================== Var ==================================================== */
    vm.misc = {

    };

    /* ======================================== Services =============================================== */
    var svc = rootService;
    var cmnSvc = commonService;
    var timeout = $timeout;
    var fbaseSvc = firebaseService;

    /* ======================================== Public Methods ========================================= */
    function goToPage(stateObj) {
      cmnSvc.goToPage(stateObj.stateName, 'root1');
    }

    /* ======================================== Private Methods ======================================== */
    function init() {
      //
    }

    init();
  }
})();
