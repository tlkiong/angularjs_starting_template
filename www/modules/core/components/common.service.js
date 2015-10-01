(function(){
	'use strict';

	angular.module('Core.Components')
		.service('common', common);

		common.$inject = ['$rootScope', '$q', '$timeout', '$window', 'toastr'];
		function common($rootScope, $q, $timeout, $window, toastr) {
			/* jshint validthis: true */
			this.$q = $q;
			this.$timeout = $timeout;
			this.$window = $window;
			this.$broadcast = _broadcast;
			this.isEmpty = _isEmpty;

			this.toastr = {
				success: function(){
					toastr.success.apply(this, arguments);
				},
				info: function(){
					toastr.info.apply(this, arguments);
				},
				warning: function(){
					toastr.warning.apply(this, arguments);
				},
				error: function(){
					toastr.error.apply(this, arguments);
				}
			};

			function _isEmpty(obj){
			    if (obj === void(0)) {
			    	return true;
			    }

			    for(var prop in obj) {
			    	if (obj[prop] === void(0)) {
			    		delete obj[prop];
			    	}
			        if(obj.hasOwnProperty(prop)) {
			            return false;
			        }
			    }

			    return true;
			}

			function _broadcast(){
				$rootScope.$broadcast.apply(this, arguments);
			}
		}
})();