(function() {
    
    'use strict';
    
    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = [];

    function sessionService() {
        var service = this;
        service.isUserLoggedIn = isUserLoggedIn;

        /* ======================================== Var ==================================================== */
        service.userData = {            
            profile_pic: 'http://img.photobucket.com/albums/v13/CrazyDiamond/YAY.png',
            full_name: 'Leng Chai 123',
            role: 'Admin',
            access_token: '6yxoib8n39y6nbMyR4xf',
            access_token_expire_time: Date.now()+86400000,
        };

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */
        function isUserLoggedIn() {
            if(!(service.userData.accessToken === undefined || service.userData.accessToken === null || service.userData.accessToken == '')  && (Date.now()/1000 <= service.userData.accessTokenExpiryTime)) {
                return true;
            } else {
                return false;
            }
        }


        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }

})();
