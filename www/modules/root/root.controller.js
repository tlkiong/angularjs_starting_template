(function() {
    'use strict';

    angular.module('Root')
        .controller('rootController', rootController);

    rootController.$inject = ['commonService', 'rootService'];

    function rootController(commonService, rootService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            
        };

        /* ======================================== Services =============================================== */
        var svc = rootService;
        var cmnSvc = commonService;

        /* ======================================== Public Methods ========================================= */
        

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();
