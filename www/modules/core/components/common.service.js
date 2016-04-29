(function() {

    'use strict';

    angular.module('Core')
        .service('commonService', commonService);

    commonService.$inject = ['$document', '$state', '$stateParams', '$q', '$timeout', '$window'];

    function commonService($document, $state, $stateParams, $q, $timeout, $window) {
        var service = this;
        service.resetForm = resetForm;
        service.getDateInDDMMMMYYYY = getDateInDDMMMMYYYY;
        service.isObjPresent = isObjPresent;
        service.getObjType = getObjType;
        service.getUUID = getUUID;
        service.isEpochTimeInMs = isEpochTimeInMs;
        service.getValInNumber = getValInNumber;
        service.loadingMode = loadingMode;
        service.goToPage = goToPage;
        service.getCurrentState = getCurrentState;
        service.getStateParam = getStateParam;

        /* ======================================== Var ==================================================== */
        service.$q = $q;
        service.$timeout = $timeout;
        service.$window = $window;

        /* ======================================== Services =============================================== */
        var stateParam = $stateParams;

        /* ======================================== Public Methods ========================================= */
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

                if (isObjPresent(stateParam)) {
                    stateObj = $state.go(stateName, { data: stateParam });
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

        function loadingMode(isLoading, containerIdToAddThisLoader) {
            if(isLoading === true || isLoading === false) {
                if(isLoading == true) {
                    if(isObjPresent(containerIdToAddThisLoader) == true) {
                        if(!isObjPresent(document.getElementById('loadingContainer'))) {
                            var loadingHtml = angular.element('<div id="loadingContainer"><div id="spinner"></div></div>');
                            var dom = angular.element(document.getElementById(containerIdToAddThisLoader));
                            dom.css("position", "relative"); // This has to be double "" as '' does not work.
                            dom.append(loadingHtml);
                            
                            var opts = {
                                lines: 13, // The number of lines to draw
                                length: 28, // The length of each line
                                width: 14, // The line thickness
                                radius: 50, // The radius of the inner circle
                                scale: 1, // Scales overall size of the spinner
                                corners: 1, // Corner roundness (0..1)
                                color: '#FFF', // #rgb or #rrggbb or array of colors
                                opacity: 0, // Opacity of the lines
                                rotate: 0, // The rotation offset
                                direction: 1, // 1: clockwise, -1: counterclockwise
                                speed: 1, // Rounds per second
                                trail: 100, // Afterglow percentage
                                fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
                                zIndex: 2e9, // The z-index (defaults to 2000000000)
                                className: 'spinner', // The CSS class to assign to the spinner
                                top: '50%', // Top position relative to parent
                                left: '50%', // Left position relative to parent
                                shadow: false, // Whether to render a shadow
                                hwaccel: false, // Whether to use hardware acceleration
                                position: 'absolute' // Element positioning
                            }
                            var target = document.getElementById('spinner')
                            spinner = new Spinner(opts).spin(target);
                        }
                    } else {
                        if(!isObjPresent(document.getElementById('loadingContainer'))) {
                            var loadingHtml = '<div id="loadingContainer"><div id="spinner"></div></div>';
                            var body = $document.find('body').eq(0);
                            body.append(loadingHtml);
                            
                            var opts = {
                                lines: 13, // The number of lines to draw
                                length: 28, // The length of each line
                                width: 14, // The line thickness
                                radius: 50, // The radius of the inner circle
                                scale: 1, // Scales overall size of the spinner
                                corners: 1, // Corner roundness (0..1)
                                color: '#FFF', // #rgb or #rrggbb or array of colors
                                opacity: 0, // Opacity of the lines
                                rotate: 0, // The rotation offset
                                direction: 1, // 1: clockwise, -1: counterclockwise
                                speed: 1, // Rounds per second
                                trail: 100, // Afterglow percentage
                                fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
                                zIndex: 2e9, // The z-index (defaults to 2000000000)
                                className: 'spinner', // The CSS class to assign to the spinner
                                top: '50%', // Top position relative to parent
                                left: '50%', // Left position relative to parent
                                shadow: false, // Whether to render a shadow
                                hwaccel: false, // Whether to use hardware acceleration
                                position: 'absolute' // Element positioning
                            }
                            var target = document.getElementById('spinner')
                            spinner = new Spinner(opts).spin(target);
                        }
                    }
                } else {
                    if(isObjPresent(spinner)) {
                        spinner.stop();
                        angular.element(document.getElementById('loadingContainer')).remove();
                    }
                }
            } else {
                throw new Error ('Parameter can only be TRUE or FALSE');
            }
        }

        // This function will return the following:
        //      - 111 => return 100
        //      - 1111 => return 1000
        //      - 53 => 50
        //      - 9987 => 9000
        //      - Less than 10 will return the number itself
        function getValInNumber(num) {
            if (getObjType(num) == number) {
                return num.toString()
                    .split('')
                    .map(function(char, index) {
                        return (index == 0) ? char : '0';
                    })
                    .join('') - 0; // -0 Will convert the entire string to a number
            } else {
                throw new Error(num + ' must be a number!');
            }
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
                '[object Function]': 'function',
                '[object Date]': 'date',
                '[object HTMLDivElement]': 'htmlDivElement',
                '[object Blob]': 'blob',
                '[object File]': 'file',
                '[object MouseEvent]': 'mouse_event',
                '[object KeyboardEvent]': 'keyboard_event'
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
         *     An invalid date will return false for this function
         *     A valid date will return true for this function
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
                var tmpStr2 = tmpStr.substring(tmpStr.indexOf('{') + 1, tmpStr.indexOf('}')).trim().replace(/\r?\n|\r/g, ""); // The RegEx here is to check for: arriage Return (CR, \r, on older Macs), Line Feed (LF, \n, on Unices incl. Linux) or CR followed by LF (\r\n, on WinDOS)
                if (isObjPresent(tmpStr2)) {
                    return true;
                } else {
                    return false;
                }
            } else if (type === 'date') {
                if (isNaN(obj.getTime())) {
                    return false; // Date is invalid
                } else {
                    return true; // Date is valid
                }
            } else if (type === 'htmlDivElement') {
                if(type.toString().length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (type === 'blob') {
                if(obj.size > 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (type === 'file') {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return true;
                    }
                }
                return false;
            } else if (type === 'mouse_event') {
                return true;
            } else if (type === 'keyboard_event') {
                return true;
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