(function() {

    'use strict';

    angular.module('Core')
        .service('commonService', commonService);

    commonService.$inject = ['$stateParams', 'sessionService', '$q', '$timeout', '$window'];

    function commonService($stateParams, sessionService, $q, $timeout, $window) {
        var service = this;
        service.resetForm = resetForm;
        service.getDateInDDMMMMYYYY = getDateInDDMMMMYYYY;
        service.isObjPresent = isObjPresent;
        service.getObjType = getObjType;
        service.getUUID = getUUID;
        service.isEpochTimeInMs = isEpochTimeInMs;
        service.goToPage = goToPage;
        service.getCurrentState = getCurrentState;
        service.getStateParam = getStateParam;

        // service.openModal = openModal;
        // service.closeModal = closeModal;

        /* ======================================== Var ==================================================== */
        service.$q = $q;
        service.$timeout = $timeout;
        service.$window = $window;

        /* ======================================== Services =============================================== */
        var sessionSvc = sessionService;
        var stateParam = $stateParams;

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
        
        function getStateParam() {
            return stateParam.data;
        }

        function getCurrentState() {
            return $state.current;
        }

        function goToPage(stateName, hasRoot, toReload, stateParam) {
            var stateObj = {};

            if (isObjPresent(stateName)) {
                if (isObjPresent(hasRoot)) {
                    stateName = 'root.' + stateName;
                }

                if(isObjPresent(stateParam)) {
                    stateObj = $state.go(stateName, {data: stateParam});
                } else {
                    stateObj = $state.go(stateName);
                }
            } else {
                if (toReload) {
                    $state.reload();
                }
            }

            return stateObj.$$state;
        }

        function isEpochTimeInMs(epochDateTime) {
            var totalNoOfCharForCurrentTimeInSeconds = Number(Math.floor(Date.now() / 1000)).toString().length;
            var totalNoOfCharForCurrentTimeInMilliseconds = Number(Date.now()).toString().length;
            if (Number(epochDateTime).toString().length == totalNoOfCharForCurrentTimeInMilliseconds) {
                return true;
            } else if (Number(epochDateTime).toString().length == totalNoOfCharForCurrentTimeInSeconds) {
                return false;
            } else {
                throw new TypeError('Parameter passed in is not in seconds or milliseconds');
            }
        }

        /**
         * Fast UUID generator, RFC4122 version 4 compliant.
         *
         * Don't understand how it works? Please visit the link as shown below. Its not meant to be readable as much as its meant to be fast
         * 
         * @author Jeff Ward (jcward.com).
         * @license MIT license
         * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
         **/
        function getUUID() {
            var lut = [];
            for (var i = 0; i < 256; i++) {
                lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
            }
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        }

        function getObjType(object) { // Would really appreciate a unit test to test all for this as manual testing didn't cover everything
            var prop = {
                '[object Object]': 'object',
                '[object Array]': 'array',
                '[object String]': 'string',
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object Null]': 'null',
                '[object Undefined]': 'undefined',
                '[object Function]': 'function'

            }

            return prop[Object.prototype.toString.call(object)];
        }

        /**
         * Thie method is inspired by rails .blank? method. This method check for is present (opposite of is blank)
         *     Rails .blank? method:
         *         - null.blank? => true
         *         - false.blank? => true
         *         - [].blank? => true
         *         - {}.blank? => true
         *         - ''.blank? => true
         *         - 5.blank? => false
         *         - 0.blank? => false
         *     Added another check is to check for function.
         *     An empty function is:
         *         - function () { }
         *         - function(param1, param2, param3) { }
         *     A non empty function is:
         *         - function() { console.log(); } 
         *     This will just check if its empty or not and not check if its syntatically correct or not
         * @param  {object}  obj [Since everything in javascript is considered an object, just pass in anything]
         * @return {Boolean}     [If its not blank, then will return true. Else, it will return false]
         */
        function isObjPresent(obj) {
            var type = getObjType(obj);
            if (type === 'object') {
                // The code below uses the Object.keys() function from ECMA Script 5+ specification. However, to ensure it can run for < ECMA Script 5, this is commented out
                // var objLength = Object.keys(obj).length;
                // if(objLength > 0) {
                //     return true;
                // } else if (objLength == 0) {
                //     return false;
                // } else {
                //     throw new Error(obj + ' comes to object if-else but the length is neither 0 or more than 0');
                // }

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return true;
                    }
                }
                return false;
            } else if (type === 'array') {
                if (obj.length > 0) {
                    return true;
                } else if (obj.length == 0) {
                    return false;
                } else {
                    throw new Error(obj + ' comes to array if-else but the length is neither 0 or more than 0');
                }
            } else if (type === 'string') {
                if (obj.length > 0) {
                    return true;
                } else if (obj.length == 0) {
                    return false
                } else {
                    throw new Error(obj + ' comes to string if-else but the length its not 0 or more than 0');
                }
            } else if (type === 'boolean') {
                if (obj === true) {
                    return true
                } else if (obj === false) {
                    return false;
                } else {
                    throw new Error(obj + ' comes to boolean if-else but is neither true or false');
                }
            } else if (type === 'number') {
                return true; // We assume if the obj passed in is a number, that means it has a value and thus present (either negative or positive value)
            } else if (type === 'null') {
                return false;
            } else if (type === 'undefined') {
                return false;
            } else if (type === 'function') {
                var tmpStr = obj.toString();
                var tmpStr2 = tmpStr.substring(tmpStr.indexOf('{')+1, tmpStr.indexOf('}')).trim().replace(/\r?\n|\r/g, ""); // The RegEx here is to check for: arriage Return (CR, \r, on older Macs), Line Feed (LF, \n, on Unices incl. Linux) or CR followed by LF (\r\n, on WinDOS)
                if(isObjPresent(tmpStr2)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                throw new Error(obj + ' is not an array, string, boolean or number. This fn only work with those for now');
            }
        }

        function getDateInDDMMMMYYYY(dateTimeInEpoch) { // Will return dd MMMM YYYY : 01 Jan 2012
            try {
                var dateTimeInNumber = Number(dateTimeInEpoch);
                var month = new Date(Number(dateTimeInEpoch)).getMonth();
                var monthInString = '';

                if (month == 0) {
                    monthInString = 'Jan';
                } else if (month == 1) {
                    monthInString = 'Feb';
                } else if (month == 2) {
                    monthInString = 'Mac';
                } else if (month == 3) {
                    monthInString = 'Apr';
                } else if (month == 4) {
                    monthInString = 'May';
                } else if (month == 5) {
                    monthInString = 'Jun';
                } else if (month == 6) {
                    monthInString = 'Jul';
                } else if (month == 7) {
                    monthInString = 'Aug';
                } else if (month == 8) {
                    monthInString = 'Sept';
                } else if (month == 9) {
                    monthInString = 'Oct';
                } else if (month == 10) {
                    monthInString = 'Nov';
                } else if (month == 11) {
                    monthInString = 'Dec';
                }

                return new Date(Number(dateTimeInEpoch)).getDay() + ' ' + monthInString + ' ' + new Date(Number(dateTimeInEpoch)).getFullYear();
            } catch (e) {
                throw new Error('date time is not in number');
            }
        }

        function resetForm(formName, formObj) {
            formName.$setPristine();
            angular.copy({}, formObj);
        }

        /* ======================================== Private Methods ======================================== */
        function init() {

        }

        init();
    }
})();
