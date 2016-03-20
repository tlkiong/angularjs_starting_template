(function() {
    'use strict';
    
    angular.module('Sample')
        .controller('sampleController', sampleController);

    sampleController.$inject = ['commonService', 'sampleService'];

    function sampleController(commonService, sampleService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {};

        /* ======================================== Services =============================================== */
        var svc = sampleService;
        var cmnSvc = commonService;

        /* ======================================== Public Methods ========================================= */

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();