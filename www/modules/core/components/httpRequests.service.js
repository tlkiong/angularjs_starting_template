(function() {
  'use strict';
  
  angular.module('Core')
    .service('httpRequestService', httpRequestService);

    httpRequestService.$inject = ['$http', 'commonService'];
    function httpRequestService($http, commonService) {
      var service = this;
      service.http = http;

      /* ======================================== Var ==================================================== */
      service.misc = {};

      var apiObj = {
        // 'provider': {
        //   baseUrl: '',
        //   'endpoint identifier as key': {
        //     methodType: 'POST' / 'GET' / 'PUT' / 'DELETE',
        //     url: '',
        //     nextUrlPart: '...'    <= This refers to eg: http://www.google.com/:id/nextUrlPart
        //     dataObj: {}
        //   }
        // }
          // Sample of GET / DELETE request below.
          // getAllGolfCourse: {
          //   methodType: 'GET',
          //   url: 'v1/GolfCourses',
          //     nextUrlPart: '...'    <= This refers to eg: http://www.google.com/:id/nextUrlPart
          //   urlParams: {},
          //   isProtected: true // This will get the access token
          // }
          // 
          // Sample of POST / PUT request below.
          // getAllGolfCourse: {
          //   methodType: 'POST',
          //   url: 'v1/GolfCourses',
          //     nextUrlPart: '...'    <= This refers to eg: http://www.google.com/:id/nextUrlPart
          //   dataObj: {},
          //   isProtected: true // This will get the access token
          // }
        }
      }

      /* ======================================== Services =============================================== */
      var cmnSvc = commonService;

      /* ======================================== Public Methods ========================================= */
      // Take note to check the way your auth token is being passed in the header (if its in the header at all)
      function http(apiObjConfig, dataObj, urlParams, accessTokenParam) {
        if(!cmnSvc.isObjPresent(apiObjConfig['provider'])) {
          throw new Error('provider cannot be empty!');
        }

        if(!cmnSvc.isObjPresent(apiObjConfig['endpointId'])) {
          throw new Error('endpointId cannot be empty!');
        }

        var deferred = cmnSvc.$q.defer();

        var headerObject = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        var dataObject = cmnSvc.isObjPresent(dataObj) ? dataObj : {};

        if(cmnSvc.isObjPresent(apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].dataObj)) {
          validateDataObjPresence(apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].dataObj, dataObj);
        }

        var processedUrl = apiObj[apiObjConfig['provider']].baseUrl + apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].url;
        
        // This should handle if there are more than 1 URL param to be entered, it will be able to process
        //    eg: URL => xxx/:userId/yyy/:objId
        //    Above will become => xxx/12345/yyy/abc
        if(cmnSvc.isObjPresent(apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].urlParams)) {
          if(cmnSvc.isObjPresent(urlParams)) {
            if(cmnSvc.getObjType(urlParams) !== 'array') {
              throw new Error('URL Params MUST be an array!');
            }
            
            urlParams.forEach(function(e) {
              if(!!validateDataObjPresence(e, apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].urlParams)) {
                processedUrl = processedUrl.replace(':' + Object.keys(e)[0], Object.values(e)[0]);
              }
            });
          } else {
            throw new Error('URL Params cannot be empty & must be an array!');
          }
        }

        var accessTokenVal = '';

        if(!!cmnSvc.isObjPresent(apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].isProtected)) {
          if(cmnSvc.isObjPresent(accessTokenParam)) {
            accessTokenVal = accessTokenParam;
          } else {
            throw new Error('Access Token cannot be empty for this API call. Provider: ' + apiObjConfig['provider'] + ' & endpoint: ' + apiObjConfig['endpointId']);
          }
        }

        // If HTTP GET/DELETE request, API params to be set to "params" key in $http request object
        // If HTTP POST/PUT request, API params to be set to "data" key in $http request object
        if (apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].methodType.toLowerCase() == 'get' || 
            apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].methodType.toLowerCase() == 'delete') {
          if(cmnSvc.isObjPresent(accessTokenVal)) {
            dataObject['access_token'] = accessTokenVal;
          }

          $http({
            method: apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].methodType,
            url: processedUrl,
            headers: headerObject,
            params: dataObject
          }).then(function(rs) {
            deferred.resolve(rs);
          }, function(err) {
            deferred.reject(err);
          });
        } else {
          $http({
            method: apiObj[apiObjConfig['provider']][apiObjConfig['endpointId']].methodType,
            url: processedUrl,
            headers: headerObject,
            data: dataObject
          }).then(function(rs) {
            deferred.resolve(rs);
          }, function(err) {
            deferred.reject(err);
          });
        }

        return deferred.promise;
      }

      /* ======================================== Private Methods ======================================== */
      // This will validate presence of the same keys on both objects.
      // It won't care if there are extra object in the paramDataObj.
      // All keys in apiObjDataObj must be present in paramDataObj
      function validateDataObjPresence(apiObjDataObj, paramDataObj) {
        for(var k in apiObjDataObj) {
          if(apiObjDataObj.hasOwnProperty(k)) {
            if(!!apiObjDataObj[k] && !cmnSvc.isObjPresent(paramDataObj[k])) {
              throw new Error('Make sure all the keys in dataObj you pass in match those in the apiObj');
            }
          }
        }
        return true;
      }

      function init() {
        AppSettings.apiConfig.forEach(function(e) {
          if(!(cmnSvc.isObjPresent(e.provider))) {
            throw new Error('Provider cannot be empty! ' + JSON.stringify(e));
          }

          if(!(cmnSvc.isObjPresent(e.baseUrl))) {
            throw new Error('baseUrl cannot be empty! ' + JSON.stringify(e));
          }

          if(!(cmnSvc.isObjPresent(apiObj[e.provider]))) {
            throw new Error('Provider not available in config: ' + JSON.stringify(e));
          }

          apiObj[e.provider].baseUrl = e.baseUrl;
        });
      }

      init();
    }
})();