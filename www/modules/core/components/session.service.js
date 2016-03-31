(function() {
    
    'use strict';
    
    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = ['commonService'];

    function sessionService(commonService) {
        var service = this;
        service.isUserLoggedIn = isUserLoggedIn;

        /* ======================================== Var ==================================================== */
        service.userData = {            
            
        };

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */
        function isUserLoggedIn() {
            // Check if user is logged in
        }

        /* ======================================== Private Methods ======================================== */
        function loadSession(callback) {
            if(cmnSvc.isObjPresent(service.userData)) {
                for(var key in service.userData) {
                    if(service.userData.hasOwnProperty(key)) {
                        service.userData[key] = localStorage.getItem(key);
                    }
                }
                if(cmnSvc.isObjPresent(service.userData)) {
                    callback(true);
                } else {
                    callback(undefined);
                }
            }
            callback(undefined);
        }

        function removeSession() {
            if(cmnSvc.isObjPresent(service.userData)) {
                for(var key in service.userData) {
                    if(service.userData.hasOwnProperty(key)) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }

        function saveSession() {
            if(cmnSvc.isObjPresent(service.userData)) {
                for(var key in service.userData) {
                    if(service.userData.hasOwnProperty(key)) {
                        localStorage.setItem(key, service.userData[key]);
                    }
                }
            }
        }
        
        function init() {
            
        }

        init();
    }

})();
