(function() {

    'use strict';

    angular.module('Core')
        .service('commonService', commonService);

    commonService.$inject = ['sessionService', '$http', '$q', '$timeout', '$window'];

    function commonService(sessionService, $http, $q, $timeout, $window) {
        var service = this;
        service.isEmpty = isEmpty;
        service.resetForm = resetForm;
        service.http = http;
        service.openModal = openModal;
        service.closeModal = closeModal;

        /* ======================================== Var ==================================================== */
        service.baseUrl = '';
        service.$q = $q;
        service.$timeout = $timeout;
        service.$window = $window;

        var apiObj = {
        	/*  Example:
        	
        		name: {
					methodType: 'POST' / 'GET' / 'PUT' / 'DELETE',
					url: '....'
        		}
        	 */
        }

        /* ======================================== Services =============================================== */
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */

        // If use foundation for apps
        // function closeModal(modalObj) {
        //     modalObj.deactivate();
        //     $timeout(function() {
        //         modalObj.destroy();
        //     }, 1000);
        // }

        // function openModal(modalName, modalObj) {
        //     var modal = {};
        //     if (modalName === 'alert') {
        //         modal = new ModalFactory({
        //             class: 'tiny dialog',
        //             overlay: true,
        //             overlayClose: false,
        //             template: '<div ng-click="close()">test</div>',
        //             contentScope: {
        //                 close: function() {
        //                     modal.deactivate();
        //                     $timeout(function() {
        //                         modal.destroy();
        //                     }, 1000);
        //                 }
        //             }
        //         });
        //     } else if (modalName === 'success') {
        //         modal = new ModalFactory({
        //             class: 'tiny dialog',
        //             overlay: true,
        //             overlayClose: false,
        //             template: '<div class="dialogContainer flexDown"><i class="icon-menu"></i><div class="dialogMsgContainer"><p ng-repeat="msg in obj.msgList" ng-style="{ \'font-size\': $index === 1 && obj.msgList.length % 3 === 0 ? \'1rem\' : \'2rem\' }">{{msg}}</p><hr class="shortHorizontalLine"><div class="dialogBtn flexAcross" ng-click=obj.btn.fn()><i class="icon-menu"></i><span>{{obj.btn.label}}</span></div></div></div>',
        //             contentScope: {
        //                 obj: modalObj
        //             }
        //         });
        //     } else if (modalName === 'information') {
        //         modal = new ModalFactory({
        //             class: 'tiny dialog',
        //             overlay: true,
        //             overlayClose: false,
        //             template: '<div class="dialogContainer flexDown"><i class="icon-menu"></i><div class="dialogMsgContainer"><p ng-repeat="msg in obj.msgList" ng-style="{ \'font-size\': $index === 1 && obj.msgList.length % 3 === 0 ? \'1rem\' : \'2rem\' }">{{msg}}</p><hr class="shortHorizontalLine"><div class="dialogBtn flexAcross" ng-click=obj.btn.fn()><i class="icon-menu"></i><span>{{obj.btn.label}}</span></div></div></div>',
        //             contentScope: {
        //                 obj: modalObj
        //             }
        //         });
        //     } else if (modalName === 'loading') {
        //         modal = new ModalFactory({
        //             class: 'tiny dialog',
        //             overlay: true,
        //             overlayClose: true,
        //             template: '<div class="dialogContainer flexDown"><div id="floatingCirclesG"><div class="f_circleG" id="frotateG_01"></div><div class="f_circleG" id="frotateG_02"></div><div class="f_circleG" id="frotateG_03"></div><div class="f_circleG" id="frotateG_04"></div><div class="f_circleG" id="frotateG_05"></div><div class="f_circleG" id="frotateG_06"></div><div class="f_circleG" id="frotateG_07"></div><div class="f_circleG" id="frotateG_08"></div></div><p>Loading . . .</p></div>',
        //             contentScope: {
        //                 close: function() {
        //                     modal.deactivate();
        //                     $timeout(function() {
        //                         modal.destroy();
        //                     }, 1000);
        //                 }
        //             }
        //         });
        //     } else {
        //         throw new Error('Modal name of ' + modalName + ' does not exist');
        //     }

        //     if (!isEmpty(modal)) {
        //         console.log(modal);
        //         return modal;
        //     }
        // }

        function http(apiObjKey, headerObj, dataObj, authToken, idOnUrl) {
            var deferred = service.$q.defer();

            var headerObject = (headerObj === undefined || headerObj === null) ? {} : headerObj;
            var dataObject = (dataObj === undefined || dataObj === null) ? {} : dataObj;

            if(authToken === true) {
                headerObject['Authorization'] = 'Token token='+sessionSvc.userData.access_token
            }

            if(idOnUrl === undefined || idOnUrl === null) {
                idOnUrl = '';
            }

            $http({
                method: apiObj[apiObjKey].methodType,
                url: service.baseUrl + apiObj[apiObjKey].url+'/'+idOnUrl,
                headers: headerObject,
                data: dataObject
            }).then(function(rs) {
                if(rs.data.status === undefined || rs.data.status === null) {
                    deferred.reject(rs.data);
                } else {
                    if (rs.data.status.toLowerCase() === 'ok') {
                        deferred.resolve(rs.data);
                    } else {
                        deferred.reject(rs.data);
                    }
                }
            }, function(err) { // This should never be called as all reponses will be a 200
                deferred.reject(err.data);
            });

            return deferred.promise;
        }

        function resetForm(formName, formObj) {
            formName.$setPristine();
            angular.copy({}, formObj);
        }

        function isEmpty(obj) {
            if (obj === void(0)) {
                return true;
            }

            for (var prop in obj) {
                if (obj[prop] === void(0)) {
                    delete obj[prop];
                }
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        }

        /* ======================================== Private Methods ======================================== */
        function init() {

        }

        init();
    }
})();
