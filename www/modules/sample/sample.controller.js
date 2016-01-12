(function() {
    'use strict';
    
    angular.module('Sample')
        .controller('sampleController', sampleController);

    sampleController.$inject = ['commonService'];

    function sampleController(commonService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {};

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();