(function() {
  'use strict';

  angular.module('Root')
    .controller('root2Controller', root2Controller);

  root2Controller.$inject = ['$scope', 'eventsService', 'firebaseService', '$timeout', 'commonService', 'rootService'];

  function root2Controller($scope, eventsService, firebaseService, $timeout, commonService, rootService) {
    var vm = this;
    vm.backToCompetitionList = backToCompetitionList;

    /* ======================================== Var ==================================================== */
    vm.misc = {

    };

    /* ======================================== Services =============================================== */
    var svc = rootService;
    var cmnSvc = commonService;
    var timeoutSvc = $timeout;
    var fbaseSvc = firebaseService;
    var eventsSvc = eventsService;

    /* ======================================== Public Methods ========================================= */
    function backToCompetitionList() {
      cmnSvc.ionicConfirmPopUp('Confirm Quit', 'Are you sure you want to quit the competition page?')
        .then(function(rs) {
          if(rs) {
            // Here is yes
            cmnSvc.removeFromLocalStorage('compId');
            cmnSvc.goToPage('competition', 'root1');
          }
        });
    }

    /* ======================================== Private Methods ======================================== */
    function init() {
      var compId = cmnSvc.getFromLocalStorage('compId');

      fbaseSvc.offAllFirebaseListener();

      eventsSvc.on_lokiIsLoaded($scope, function() {
        if(cmnSvc.isObjPresent(svc.competitionDataFromDb)) {
          //
        } else {
          if(!cmnSvc.isObjPresent(svc.compData)) {
            cmnSvc.showIonicLoading('Getting competition data . . .');
            fbaseSvc.getCompetitionData(compId)
              .then(function(rs) {
                cmnSvc.hideIonicLoading();
                if(cmnSvc.isObjPresent(rs)) {
                  console.log('rs: ',rs);
                  svc.addCompetitionData(rs);
                  eventsSvc.event_stateModified(0);
                  eventsSvc.on_compDataModified($scope, function(data) {
                    if(data === 'isDeleted') {
                      cmnSvc.ionicErrorPopUp('This competition has been deleted. Please contact the organiser for more information')
                        .then(function() {
                          cmnSvc.removeFromLocalStorage('compId')
                          cmnSvc.goToPage('competition', 'root1');
                        });
                    }
                  });
                } else {
                  cmnSvc.ionicErrorPopUp('Error fetching comeptition info. It seems like it has been deleted. Please contact the organiser for more information')
                    .then(function() {
                      cmnSvc.removeFromLocalStorage('compId')
                      cmnSvc.goToPage('competition', 'root1');
                    });
                }
              }, function(er) {
                cmnSvc.hideIonicLoading();
                cmnSvc.ionicErrorPopUp('Error getting competition data. Please contact the system admin.');
              });
          }
        }
      });




    }

    init();
  }
})();
