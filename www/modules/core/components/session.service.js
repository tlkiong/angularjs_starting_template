(function() {
  'use strict';
  
  angular.module('Core')
    .service('sessionService', sessionService);

  sessionService.$inject = ['$timeout', 'firebaseService', 'commonService'];

  function sessionService($timeout, firebaseService, commonService) {
    var service = this;
    service.isUserLoggedIn = isUserLoggedIn;

    /* ======================================== Var ==================================================== */
    service.userData = {            
      // emailAdd: '',
      // password: '',
      // firstName: '',
      // lastName: '',
      // nickname: '',
      // dateOfBirth: , // Epoch time in ms
      // uid: '',
      // address: '',
      // contactNumber: '',
      // role: '',
      // img: '',
      // gender: '' // 'm' or 'f' only
    };

    /* ======================================== Services =============================================== */
    var cmnSvc = commonService;
    var fbaseSvc = firebaseService;
    var timeout = $timeout;

    /* ======================================== Public Methods ========================================= */
    // Two possible return typs:
    //    If return boolean, means userData exist
    //    If return value, that means userData don't exist and need to fetch
    function isUserLoggedIn() {
      var deferred = cmnSvc.$q.defer();

      // TODO: This is just a hack. What if it takes longer than 1 second to initialize the 'auth' object, this will fail
      $timeout(function() {
        var signedInUser = fbaseSvc.getCurrentSignedInUser(false);
              
        if(cmnSvc.isObjPresent(signedInUser)) {
          if(cmnSvc.isObjPresent(service.userData)) {
            if(signedInUser.email === service.userData.emailAdd) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          } else {
            fbaseSvc.getUserProfile(signedInUser.uid)
              .then(function(rs) {
                if(cmnSvc.isObjPresent(rs)) {
                  service.userData = rs;
                  
                  if(!cmnSvc.isObjPresent(service.userData.img)) {
                    service.userData['profileImgStyle'] = {
                      'background-color': cmnSvc.getRandomChameleonColorPair()
                    }
                  }

                  deferred.resolve();
                } else {
                  deferred.reject();
                }
              }, function(err) {
                deferred.reject(err);
              });
          }
        } else {
          deferred.reject();
        }
      }, 1000);

      return deferred.promise;
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