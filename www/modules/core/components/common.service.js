(function() {
  'use strict';

  angular.module('Core')
    .service('commonService', commonService);

  commonService.$inject = [];

  function commonService() {
    var service = this;
    service.getMonthNameFromDateObj = getMonthNameFromDateObj;
    service.getDateInDDMMMMYYYY = getDateInDDMMMMYYYY;
    service.getMonthNameFromEpochDate = getMonthNameFromEpochDate;
    service.getDayInEpoch = getDayInEpoch;
    service.isObjPresent = isObjPresent;
    service.getObjType = getObjType;
    service.getUUID = getUUID;
    service.isEpochTimeInMs = isEpochTimeInMs;
    service.getValInNumber = getValInNumber;
    service.flattenArray = flattenArray;
    service.getRandomChameleonColorPair = getRandomChameleonColorPair;
    service.removeFromLocalStorage = removeFromLocalStorage;
    service.getFromLocalStorage = getFromLocalStorage;
    service.saveToLocalStorage = saveToLocalStorage;
    service.roundNumberByDecimalPlaces = roundNumberByDecimalPlaces;
    service.getAllQueryStrings = getAllQueryStrings;
    service.convertObjToArray = convertObjToArray;
    service.isObjNotPresentInArr = isObjNotPresentInArr;

    /* ======================================== Var ==================================================== */
    var spinner; // This is for spin.js
    var spinnerList = [];

    /* ======================================== Services =============================================== */

    /* ======================================== Public Methods ========================================= */
    function isObjNotPresentInArr(arr1, val) {
      let isNotPresent = true;
      for(let i=0, j=arr1.length; i<j; i++) {
        if(arr1[i].name === val.name) {
          isNotPresent = false;
          break;
        }
      }

      return isNotPresent;
    }

    function convertObjToArray(obj, propNameForKey){
      let arr = [];

      for(let k in obj) {
        if(obj.hasOwnProperty(k)) {
          if(getObjType(propNameForKey) === 'string' && isObjPresent(propNameForKey)){
            obj[k][propNameForKey] = k;
          }
          arr.push(obj[k]);
        }
      }

      return arr;
    }

    function getAllQueryStrings() {
      return window.location.href.substring(window.location.href.indexOf('?') + 1).split('&').map(function(currentE) {
        return { qStringKey: currentE.split('=')[0], qStringVal: currentE.split('=')[1] }
      });
    }

    // Code is from: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary#answer-12830454
    function roundNumberByDecimalPlaces(num, numberOfDecimalPlaces) {
      if(!isObjPresent(num) && !isObjPresent(numberOfDecimalPlaces)) {
        throw new Error ('roundNumberByDecimalPlaces have 2 params. Either one must be present');
      } else {
        if(!isObjPresent(num) && isObjPresent(numberOfDecimalPlaces)) {
          return 0;
        } else if (isObjPresent(num) && !isObjPresent(numberOfDecimalPlaces)) {
          return num;
        }
      }

      if(!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + numberOfDecimalPlaces)  + "e-" + numberOfDecimalPlaces);
      } else {
        var arr = ("" + num).split("e");
        var sig = ""
        if(+arr[1] + numberOfDecimalPlaces > 0) {
          sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + numberOfDecimalPlaces)) + "e-" + numberOfDecimalPlaces);
      }
    }

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
        '[object KeyboardEvent]': 'keyboard_event',
        '[object HTMLElement]': 'htmlElement'
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
      } else if (type === 'htmlDivElement' || type === 'htmlElement') {
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

    function getDayInEpoch(validJsDate) {
      if(!isObjPresent(validJsDate)) {
        validJsDate = Date.now();
      }

      var d = new Date(validJsDate);
      if(d === 'Invalid Date') {
        return d;
      }

      return (new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime();
    }

    function getMonthNameFromEpochDate(dateTimeInEpoch) {
      try {
        var month = new Date(Number(dateTimeInEpoch)).getMonth();
        getMonthNameFromDateObj(month);
      } catch (e) {
        throw new Error('date time is not in number');
      }
    }

    function getDateInDDMMMMYYYY(dateTimeInEpoch) { // Will return dd MMMM YYYY : 01 Jan 2012
      try {
        var dateTimeInNumber = Number(dateTimeInEpoch);
        var month = new Date(Number(dateTimeInEpoch)).getMonth();
        var monthInString = getMonthNameFromDateObj(month);

        return new Date(Number(dateTimeInEpoch)).getDate() + ' ' + monthInString + ' ' + new Date(Number(dateTimeInEpoch)).getFullYear();
      } catch (e) {
        throw new Error('date time is not in number');
      }
    }

    function getMonthNameFromDateObj(number) {
      if(number >= 0 && number <= 11) {
        var monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];
        
        return monthNames[number];
      }
    }

    /* ======================================== Private Methods ======================================== */
    function init() {

    }

    init();
  }
})();
