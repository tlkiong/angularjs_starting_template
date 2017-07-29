(function() {
  'use strict';
  
  angular.module('Auth')
    .controller('authController', authController);

  authController.$inject = ['sessionService', 'firebaseService', 'commonService', 'authService'];

  function authController(sessionService, firebaseService, commonService, authService) {
    var vm = this;
    vm.login = login;

    /* ======================================== Var ==================================================== */
    vm.misc = {};
    vm.userData = {
      emailAdd: 'admin@falive.com',
      password: '123456',
    }

    /* ======================================== Services =============================================== */
    var svc = authService;
    var cmnSvc = commonService;
    var fbaseSvc = firebaseService;
    var sessionSvc = sessionService;

    /* ======================================== Public Methods ========================================= */
    function login() {
      cmnSvc.showIonicLoading();
      fbaseSvc.signInWithEmailAndPassword(vm.userData)
        .then(function(rs) {
          cmnSvc.hideIonicLoading();

          sessionSvc.userData = rs;
          cmnSvc.goToPage('competition', true);
        }, function(err) {
          cmnSvc.hideIonicLoading();
          cmnSvc.ionicErrorPopUp(err);
        })
    }

    /* ======================================== Private Methods ======================================== */
    function init() {
      
    }

    init();
  }
})();