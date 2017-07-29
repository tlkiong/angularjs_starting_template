(function() {
  'use strict';

  angular.module('Root')
    .service('rootService', rootService);

    rootService.$inject = ['$rootScope', 'competitionService', 'eventsService', 'firebaseService', 'commonService'];
    function rootService($rootScope, competitionService, eventsService, firebaseService, commonService) {
      var service = this;

      /* ======================================== Var ==================================================== */
      service.misc = {};

      service.compData = {
        id: '',
        bannerImgInBase64: '', // This is in base64
        thumbnailImgInBase64: '',
        name: '',
        startAt: undefined, // In ms
        endAt: undefined, // In ms
        venueName: '',
        venueAddress: '',
        belongsTo: {
          id: '',
          userName: ''
        },
        programData: [],
        participants: []
      };

      var oriCompData = {
        id: '',
        bannerImgInBase64: '', // This is in base64
        thumbnailImgInBase64: '',
        name: '',
        startAt: undefined, // In ms
        endAt: undefined, // In ms
        venueName: '',
        venueAddress: '',
        belongsTo: {
          id: '',
          userName: ''
        },
        programData: [],
        participants: []
      };

      /* ======================================== Services =============================================== */
      var cmnSvc = commonService;
      var fbaseSvc = firebaseService;
      var eventsSvc = eventsService;
      var compSvc = competitionService;

      /* ======================================== Public Methods ========================================= */

      /* ======================================== Private Methods ======================================== */
      function startListenToCompData(compId) {
//         fbaseSvc.listenToGetCompetitionDataChanges(function(snapshot) {
//           var compData = snapshot.val();
// console.log('compData: ',compData);
//           service.compData['id'] = compData.id;
//           service.compData['bannerImgInBase64'] = compData.bannerImgInBase64; // This is in base64
//           service.compData['name'] = compData.name;
//           service.compData['startAt'] = compData.startAt; // In ms
//           service.compData['endAt'] = compData.endAt; // In ms
//           service.compData['venueName'] = compData.venueName;
//           service.compData['venueAddress'] = compData.venueAddress;
//           service.compData['belongsTo']['id'] = compData.belongsTo.id;
//           service.compData['belongsTo']['userName'] = compData.belongsTo.userName;
//           eventsSvc.event_stateModified(0);
//         }, compId);

//         fbaseSvc.listenToGetDeletedCompetition(function(snapshot) {
//           resetCompData();
//           eventsSvc.event_stateModified(0, 'isDeleted');
//         }, compId)
      }

      function resetCompData() {
        angular.copy(oriCompData, service.compData);
      }

      function getCompDataFromCompSvc() {
        angular.copy(compSvc.competitionDataFromDb, oriCompData);
        angular.copy(compSvc.competitionDataFromDb, service.compData);
      }

      function init() {
        fbaseSvc.offAllFirebaseListener();

        eventsSvc.on_lokiIsLoaded($rootScope, function() {
          if(cmnSvc.isObjPresent(compSvc.competitionDataFromDb)) {
            getCompDataFromCompSvc();
          } else {
            compSvc.getCacheCompetitionData(function(hasData){
              if(!!hasData) {
                getCompDataFromCompSvc();
              }
            });;
          }
        });

        eventsSvc.on_compDataModified($rootScope, function(data) {
          if(data !== 'isDeleted') {
            getCompDataFromCompSvc();
          }
        });
      }

      init();
    }
})();
