(function() {
  'use strict';

  angular.module('Core')
    .service('commonService', commonService);

  commonService.$inject = ['$ionicPopup', '$ionicLoading', '$document', '$state', '$stateParams', '$q', '$timeout', '$window'];

  function commonService($ionicPopup, $ionicLoading, $document, $state, $stateParams, $q, $timeout, $window) {
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
    service.getAllStates = getAllStates
    service.flattenArray = flattenArray;
    service.getRandomChameleonColorPair = getRandomChameleonColorPair;
    service.removeFromLocalStorage = removeFromLocalStorage;
    service.getFromLocalStorage = getFromLocalStorage;
    service.saveToLocalStorage = saveToLocalStorage;

    /* Ionic Related */
    service.ionicPopUp = ionicPopUp;
    service.ionicErrorPopUp = ionicErrorPopUp;
    service.ionicInfoPopUp = ionicInfoPopUp;
    service.ionicConfirmPopUp = ionicConfirmPopUp;
    service.showIonicLoading = showIonicLoading;
    service.hideIonicLoading = hideIonicLoading;
    /* End: Ionic Related */


    /* ======================================== Var ==================================================== */
    service.$q = $q;
    service.$timeout = $timeout;
    service.$window = $window;

    var spinner; // This is for spin.js
    var spinnerList = [];

    /* ======================================== Services =============================================== */
    var stateParam = $stateParams;

    /* Ionic Related */
    var ionicLoadingSvc = $ionicLoading;
    var ionicPopupSvc = $ionicPopup;
    /* End: Ionic Related */

    /* ======================================== Public Methods ========================================= */

    /* ---------------------------------------- Ionic Related ---------------------------------------- */
    function hideIonicLoading() {
      ionicLoadingSvc.hide();
    }

    function showIonicLoading(message) {
      if (!isObjPresent(message)) {
        message = 'Loading . . .';
      }

      return ionicLoadingSvc.show({
        template: message
      });
    }

    function ionicConfirmPopUp(title, message) {
      if(!isObjPresent(title)) throw new Error('title params cannot be ' + title);
      if(!isObjPresent(message)) throw new Error('message params cannot be ' + message);

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
    /* ---------------------------------------- End: Ionic Related ---------------------------------------- */

    function removeFromLocalStorage(name) {
      return localStorage.removeItem(name);
    }

    function getFromLocalStorage(name) {
      return JSON.parse(localStorage.getItem(name));
    }

    function saveToLocalStorage(name, obj) {
      return localStorage.setItem(name, JSON.stringify(obj));
    }

    function isMobileDevice(type) {
      var isAndroid = navigator.userAgent.match(/Android/i);
      var isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i);
      var isBlackberry = navigator.userAgent.match(/BlackBerry/i);
      var isOperaMini = navigator.userAgent.match(/Opera Mini/i);
      var isWindows = navigator.userAgent.match(/IEMobile/i);

      if(isObjPresent(type)) {
        type = type.toLowerCase();
        if (type === 'android') {
          if (isAndroid) return 'android';

          return false;
        } else if (type === 'blackberry') {
          if (isBlackberry) return 'blackberry';

          return false;
        } else if (type === 'ios') {
          if (isIos) return 'ios';

          return false;
        } else if (type === 'opera') {
          if (isOperaMini) return 'opera';

          return false;
        } else if (type === 'windows') {
          if (isWindows) return 'windows';

          return false;
        }
      } else {
        if (isAndroid) {
          return 'android';
        } else if (isBlackberry) {
          return 'blackberry';
        } else if (isIos) {
          return 'ios';
        } else if (isOperaMini) {
          return 'opera';
        } else if (isWindows) {
          return 'windows';
        } else {
          return false;
        }
      }
    }

    /**
     * The below is shamelessly taken from 'http://stackoverflow.com/a/27282907'
     *  - This is done in a linear time O(n) without recursion
     *  - Memory complexity is O(1) or O(n) if mutable param is set to false
     */
    function flattenArray(array, mutable) {
      var toString = Object.prototype.toString;
      var arrayTypeStr = '[object Array]';

      var result = [];
      var nodes = (mutable && array) || array.slice();
      var node;

      if (!array.length) {
        return result;
      }

      node = nodes.pop();

      do {
        if (toString.call(node) === arrayTypeStr) {
          nodes.push.apply(nodes, node);
        } else {
          result.push(node);
        }
      } while (nodes.length && (node = nodes.pop()) !== undefined);

      result.reverse(); // we reverse result to restore the original order
      return result;
    }

    function getRandomChameleonColorPair() {
      // This colour pair is taken from => https://camo.githubusercontent.com/747d1a53ed34124c5ab7fb9007f4ccda8da37398/687474703a2f2f692e696d6775722e636f6d2f776b4747576b4e2e706e67
      // From the repo at https://github.com/ViccAlexander/Chameleon
      var colourPair = [
        ['#E74C3C', '#C0392B'], // Flat red
        ['#E67E22', '#D35400'], // Flat orange
        ['#FFCD02', '#FFA800'], // Flat yellow
        ['#f0deb4', '#d5c295'], // Flat sand
        ['#34495e', '#2c3e50'], // Flat navy blue
        ['#2b2b2b', '#262626'], // Flat black
        ['#9b59b6', '#8e44ad'], // Flat magenta
        ['#3a6f81', '#356272'], // Flat teal
        ['#3498db', '#2980b9'], // Flat sky blue
        ['#2ecc71', '#27ae60'], // Flat green
        ['#1abc9c', '#16a085'], // Flat mint
        ['#ecf0f1', '#bdc3c7'], // Flat white
        ['#95a5a6', '#7f8c8d'], // Flat grey
        ['#345f41', '#2d5036'], // Flat forest green
        ['#745ec5', '#5b48a2'], // Flat purple
        ['#5e4534', '#503b2c'], // Flat brown
        ['#5e345e', '#4f2b4f'], // Flat plum
        ['#ef717a', '#d95459'], // Flat watermelon
        ['#a5c63b', '#8eb021'], // Flat lime
        ['#f47cc3', '#d45c9e'], // Flat pink
        ['#79302a', '#662621'], // Flat maroon
        ['#a38671', '#8e725e'], // Flat coffee
        ['#b8c9f1', '#99abd5'], // Flat powder blue
        ['#5065a1', '#394c81']  // Flat blue
      ];

      colourPair = flattenArray(colourPair);

      return colourPair[Math.floor(Math.random() * (colourPair.length - 1))];
    }

    function getAllStates() {
      return $state.get();
    }

    function getStateParam(hasUrlParam) {
      if(isObjPresent(hasUrlParam)) {
        return stateParam;
      }

      return stateParam.data;
    }

    function getCurrentState() {
      return $state.current;
    }

    function goToPage(stateName, hasRoot, toReload, stateParam, urlParams) {
      var stateObj = {};

      if (isObjPresent(stateName)) {
        if (isObjPresent(hasRoot)) {
          if(hasRoot === true) {
            stateName = 'root.' + stateName;
          } else if (getObjType(hasRoot) === 'string') {
            stateName = hasRoot + '.' + stateName;
          }
        }

        if (isObjPresent(stateParam) || isObjPresent(urlParams)) {
          var stateNUrlParam;

          if (isObjPresent(urlParams)) {
            urlParams['data'] = stateParam;
            stateNUrlParam = urlParams
          } else {
            stateNUrlParam = {
              data: stateParam
            }
          }

          stateObj = $state.go(stateName, stateNUrlParam);
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

    function loadingMode(isLoading, containerIdToAddThisLoader, spinnerTxt) {
      if(isLoading === true || isLoading === false) {
        if(isLoading == true) {
          if(isObjPresent(containerIdToAddThisLoader) == true) {
            if(!isObjPresent(document.getElementById('loadingContainer-' + containerIdToAddThisLoader))) {
              var loadingHtml;
              if(isObjPresent(spinnerTxt)) {
                loadingHtml = angular.element('<div class="loadingContainer" id="loadingContainer-' + containerIdToAddThisLoader + '"><div id="spinner-' + containerIdToAddThisLoader + '"></div><div class="spinnerContainer"><div class="spinnerTxt">' + spinnerTxt + '</div></div></div>');
              } else {
                loadingHtml = angular.element('<div class="loadingContainer" id="loadingContainer-' + containerIdToAddThisLoader + '"><div id="spinner-' + containerIdToAddThisLoader + '"></div></div>');
              }
              var dom = angular.element(document.getElementById(containerIdToAddThisLoader));
              // dom.css("position", "relative"); // This has to be double "" as '' does not work.
              dom.append(loadingHtml);

              var opts = {
                lines: 11, // The number of lines to draw
                length: 10, // The length of each line
                width: 4, // The line thickness
                radius: 15, // The radius of the inner circle
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
                top: '40%', // Top position relative to parent
                left: '50%', // Left position relative to parent
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                position: 'absolute' // Element positioning
              }
              var target = document.getElementById('spinner-' + containerIdToAddThisLoader + '')
              spinnerList.push({
                elementId: 'loadingContainer-' + containerIdToAddThisLoader,
                spinner: new Spinner(opts).spin(target)
              });
            }
          } else {
            if(!isObjPresent(document.getElementById('loadingContainer'))) {
              var loadingHtml;
              if(isObjPresent(spinnerTxt)) {
                loadingHtml = angular.element('<div id="loadingContainer"><div id="spinner"></div><div class="spinnerContainer"><div class="spinnerTxt">' + spinnerTxt + '</div></div></div>');
              } else {
                loadingHtml = angular.element('<div id="loadingContainer"><div id="spinner"></div></div>');
              }
              var body = $document.find('body').eq(0);
              body.append(loadingHtml);

              var opts = {
                lines: 11, // The number of lines to draw
                length: 10, // The length of each line
                width: 4, // The line thickness
                radius: 15, // The radius of the inner circle
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
                top: '40%', // Top position relative to parent
                left: '50%', // Left position relative to parent
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                position: 'absolute' // Element positioning
              }
              var target = document.getElementById('spinner')
              spinnerList.push({
                elementId: 'loadingContainer',
                spinner: new Spinner(opts).spin(target)
              });
            }
          }
        } else {
          if(isObjPresent(spinnerList)) {
            if(isObjPresent(containerIdToAddThisLoader)) {
              spinnerList.forEach(function(e) {
                if(e.elementId === 'loadingContainer-' + containerIdToAddThisLoader) {
                  angular.element(document.getElementById(e.elementId)).remove();
                  e.spinner.stop();
                }
              });
            } else {
              // Here should have only 1
              spinnerList.forEach(function(e) {
                if(e.elementId === 'loadingContainer') {
                  angular.element(document.getElementById(e.elementId)).remove();
                  e.spinner.stop();
                }
              });
            }
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

      var objType = prop[Object.prototype.toString.call(object)];

      if(objType == 'number' && object.toString() == 'NaN') {
        return 'NaN';
      } else {
        return objType;
      }
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
        // This will traverse the entire object keys & check the values.
        // If even one of the values isPresent (the type & value is defined in this function itself)
        //    then it will assume the obj IS present
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if(isObjPresent(obj[key]) === true) {
              return true;
            }
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
      } else if (type === 'NaN') {
        return false;
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

        return new Date(Number(dateTimeInEpoch)).getDate() + ' ' + monthInString + ' ' + new Date(Number(dateTimeInEpoch)).getFullYear();
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
