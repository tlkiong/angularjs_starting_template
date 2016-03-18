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
	            var dataObj = cmnSvc.isObjPresent(dataObj) ? dataObj : {};

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

	            if (cmnSvc.isObjPresent(dataObj) && (cmnSvc.isObjPresent(dataObj.image_url))) {
	                dataObj.image_url = dataObj.image_url.$ngfDataUrl.substring(dataObj.image_url.$ngfDataUrl.indexOf(',') + 1);
	            }

	            // If HTTP GET request, API params to be set to "params" key in $http request object
	            // If HTTP POST/PUT request, API params to be set to "data" key in $http request object
	            if (apiObj[apiObjKey].methodType.toLowerCase() == 'get' || apiObj[apiObjKey].methodType.toLowerCase() == 'delete') {
	                $http({
	                    method: apiObj[apiObjKey].methodType,
	                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
	                    headers: headerObject,
	                    params: dataObj
	                }).then(function(rs) {
	                    if(cmnSvc.isObjPresent(rs.data.status)) {
	                        if (rs.data.status.toLowerCase() === 'ok') {
	                            deferred.resolve(rs.data);
	                        } else {
	                            deferred.reject(rs.data);
	                        }
	                    } else {
	                        deferred.reject(rs.data);
	                    }
	                }, function(err) { // This should never be called as all reponses will be a 200
	                    console.log('Non processed error by server. ' + err.data); // To be removed for prod
	                });
	            } else {
	                $http({
	                    method: apiObj[apiObjKey].methodType,
	                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
	                    headers: headerObject,
	                    data: dataObj
	                }).then(function(rs) {
	                    if(cmnSvc.isObjPresent(rs.data.status)) {
	                        if (rs.data.status.toLowerCase() === 'ok') {
	                            deferred.resolve(rs.data);
	                        } else {
	                            deferred.reject(rs.data);
	                        }
	                    } else {
	                        deferred.reject(rs.data);
	                    }
	                }, function(err) { // This should never be called as all reponses will be a 200
	                    console.log('Non processed error by server. ' + err.data); // To be removed for prod
	                });
	            }

	            return deferred.promise;
	        }

	        /* ======================================== Private Methods ======================================== */

		}
})();