(function() {
  'use strict';

  angular.module('Core')
    .service('commonNgService', commonNgService);

  commonNgService.$inject = ['$document', '$state', '$stateParams', 'commonService'];

  function commonNgService($document, $state, $stateParams, commonService) {
    var service = this;
    service.resetForm = resetForm;
    service.goToPage = goToPage;
    service.getCurrentState = getCurrentState;
    service.getStateParam = getStateParam;
    service.getAllStates = getAllStates;
    service.loadingMode = loadingMode;

    /* ======================================== Var ==================================================== */

    /* ======================================== Services =============================================== */
    var cmnSvc = commonService;
    var stateParam = $stateParams;
    var docSvc = $document;

    /* ======================================== Public Methods ========================================= */
    function loadingMode(isLoading, containerIdToAddThisLoader, spinnerTxt) {
      if(isLoading === true || isLoading === false) {
        if(isLoading == true) {
          if(cmnSvc.isObjPresent(containerIdToAddThisLoader) == true) {
            if(!cmnSvc.isObjPresent(document.getElementById('loadingContainer-' + containerIdToAddThisLoader))) {
              var loadingHtml;
              if(cmnSvc.isObjPresent(spinnerTxt)) {
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
            if(!cmnSvc.isObjPresent(document.getElementById('loadingContainer'))) {
              var loadingHtml;
              if(cmnSvc.isObjPresent(spinnerTxt)) {
                loadingHtml = angular.element('<div id="loadingContainer"><div id="spinner"></div><div class="spinnerContainer"><div class="spinnerTxt">' + spinnerTxt + '</div></div></div>');
              } else {
                loadingHtml = angular.element('<div id="loadingContainer"><div id="spinner"></div></div>');
              }
              var body = docSvc.find('body').eq(0);
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
          if(cmnSvc.isObjPresent(spinnerList)) {
            if(cmnSvc.isObjPresent(containerIdToAddThisLoader)) {
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

    function getAllStates() {
      return $state.get();
    }

    function getStateParam(hasUrlParam) {
      if(cmnSvc.isObjPresent(hasUrlParam)) {
        return stateParam;
      }

      return stateParam.data;
    }

    function getCurrentState() {
      return $state.current;
    }

    function goToPage(stateName, hasRoot, toReload, stateParam, urlParams) {
      var stateObj = {};

      if (cmnSvc.isObjPresent(stateName)) {
        if (cmnSvc.isObjPresent(hasRoot)) {
          if(hasRoot === true) {
            stateName = 'root.' + stateName;
          } else if (getObjType(hasRoot) === 'string') {
            stateName = hasRoot + '.' + stateName;
          }
        }

        if (cmnSvc.isObjPresent(stateParam) || cmnSvc.isObjPresent(urlParams)) {
          var stateNUrlParam;

          if (cmnSvc.isObjPresent(urlParams)) {
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
