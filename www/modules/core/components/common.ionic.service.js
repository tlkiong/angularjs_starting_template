(function() {
  'use strict';

  angular.module('Core')
    .service('commonIonicService', commonIonicService);

  commonIonicService.$inject = ['$ionicPopup', '$ionicLoading', 'commonService'];

  function commonIonicService($ionicPopup, $ionicLoading, commonService) {
    var service = this;
    service.ionicPopUp = ionicPopUp;
    service.ionicErrorPopUp = ionicErrorPopUp;
    service.ionicInfoPopUp = ionicInfoPopUp;
    service.ionicConfirmPopUp = ionicConfirmPopUp;
    service.showIonicLoading = showIonicLoading;
    service.hideIonicLoading = hideIonicLoading;

    /* ======================================== Var ==================================================== */
    var spinner; // This is for spin.js
    var spinnerList = [];

    /* ======================================== Services =============================================== */
    var cmnSvc = commonService;
    var ionicLoadingSvc = $ionicLoading;
    var ionicPopupSvc = $ionicPopup;

    /* ======================================== Public Methods ========================================= */
    function hideIonicLoading() {
      ionicLoadingSvc.hide();
    }

    function showIonicLoading(message) {
      if (!cmnSvc.isObjPresent(message)) {
        message = 'Loading . . .';
      }

      return ionicLoadingSvc.show({
        template: message
      });
    }

    function ionicConfirmPopUp(title, message) {
      if(!cmnSvc.isObjPresent(title)) throw new Error('title params cannot be ' + title);
      if(!cmnSvc.isObjPresent(message)) throw new Error('message params cannot be ' + message);

      return ionicPopUp('confirm', title, message);
    }

    function ionicInfoPopUp(message) {
      return ionicPopUp('alert', 'Information', message);
    }

    function ionicErrorPopUp(message) {
      return ionicPopUp('alert', 'ERROR', message);
    }

    /**
     * To pop up alert, confirm or a custom pop up
     * @param  {[string]} type [The type of pop up: alert, confirm, custom]
     * @param  {[string]} title   [The title that will be shown in the pop up]
     * @param  {[string]} message [The message in the body for alert and confirm. But for custom, pass in an object of
     *                                message: {
     *                                    template: '',
     *                                    subTitle: '',
     *                                    scope: $scope,
     *                                    buttons: [{
     *                                        text: 'Cancel'
     *                                    }, {
     *                                        text: '<b>Save</b>',
     *                                        type: 'button-positive',
     *                                        onTap: function(e) {
     *                                          if (!$scope.data.wifi) {
     *                                              //don't allow the user to close unless he enters wifi password
     *                                              e.preventDefault();
     *                                          } else {
     *                                              return $scope.data.wifi;
     *                                          }
     *                                  }]
     *                                }
     * ]
     * @return {[promise]}         [This will return a promise]
     */
    function ionicPopUp(type, title, message) {
      if (type === 'confirm') {
        return ionicPopupSvc.confirm({
          title: title,
          template: message
        });
        // eg usage:
        //     xxx.then(function(rs){
        //       if(rs) {
        //         console.log('yes');
        //       } else {
        //         console.log('no');
        //       }
        //     });
      } else if (type === 'alert') {
        return ionicPopupSvc.alert({
          title: title,
          template: message
        });
        // eg usage:
        //     xxx.then(function(rs){
        //       console.log('ya');
        //     });
      } else if (type === 'custom') {
        return ionicPopupSvc.show({
          template: '<input type="password" ng-model="data.wifi">',
          title: 'Enter Wi-Fi Password',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            { text: 'Cancel' }, {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.wifi) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data.wifi;
                }
              }
            }
          ]
        });

        // myPopup.then(function(res) {
        //   console.log('Tapped!', res);
        // });
        // $timeout(function() {
        //   myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
      }
    }

    /* ======================================== Private Methods ======================================== */
    function init() {

    }

    init();
  }
})();
