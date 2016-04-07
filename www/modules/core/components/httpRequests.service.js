(function() {
	'use strict';
	
	angular.module('Core')
		.service('httpRequestService', httpRequestService);

		httpRequestService.$inject = ['$http', 'commonService'];
		function httpRequestService($http, commonService) {
			var service = this;
			service.http = http;

			/* ======================================== Var ==================================================== */
			service.misc = {
	        	
	        };
	        service.baseUrl = '';
			var apiObj = {
	        	/*  Example:
	        	
	        		name: {
						methodType: 'POST' / 'GET' / 'PUT' / 'DELETE',
						url: '...',
						nextUrlPart: '...'		<= This refers to eg: http://www.google.com/:id/nextUrlPart
	        		}
	        	 */
	        }

	        /* ======================================== Services =============================================== */
	        var cmnSvc = commonService;

	        /* ======================================== Public Methods ========================================= */
	        // Take note to check the way your auth token is being passed in the header (if its in the header at all)
	        function http(apiObjKey, headerObj, dataObj, authToken, idOnUrl) {
	            var deferred = cmnSvc.$q.defer();

	            var headerObject = cmnSvc.isObjPresent(headerObj) ? headerObj : {};
	            var dataObject = cmnSvc.isObjPresent(dataObj) ? dataObj : {};

	            if (authToken === true) {
	                headerObject['Authorization'] = 'Token token=' + sessionSvc.userData.access_token
	            }

	            if(cmnSvc.isObjPresent(idOnUrl)) {
	                idOnUrl = '/' + idOnUrl;
	            } else {
	                idOnUrl = '';
	            }

	            var nextUrl = '';
	            if (cmnSvc.isObjPresent(apiObj[apiObjKey].nextUrlPart)) {
	                nextUrl = '/' + apiObj[apiObjKey].nextUrlPart;
	            }

	            if (cmnSvc.isObjPresent(dataObject) && (cmnSvc.isObjPresent(dataObject.image_url))) {
	                dataObject.image_url = dataObject.image_url.$ngfDataUrl.substring(dataObject.image_url.$ngfDataUrl.indexOf(',') + 1);
	            }

	            // If HTTP GET/DELETE request, API params to be set to "params" key in $http request object
	            // If HTTP POST/PUT request, API params to be set to "data" key in $http request object
	            if (apiObj[apiObjKey].methodType.toLowerCase() == 'get' || apiObj[apiObjKey].methodType.toLowerCase() == 'delete') {
	                $http({
	                    method: apiObj[apiObjKey].methodType,
	                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
	                    headers: headerObject,
	                    params: dataObject
	                }).then(function(rs) {
	                	deferred.resolve(rs);
	                }, function(err) {
	                    deferred.reject(err);
	                });
	            } else {
	                $http({
	                    method: apiObj[apiObjKey].methodType,
	                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
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

		}
})();