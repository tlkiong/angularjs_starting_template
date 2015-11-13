(function() {
    'use strict';
    
    angular.module("Sample")
        .controller("sampleController", sampleController);

    sampleController.$inject = [];

    function sampleController() {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {};

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();