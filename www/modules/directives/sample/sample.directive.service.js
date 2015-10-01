(function() {
    'use strict';

    angular.module('Directives')
        .service('dropdownService', dropdownService);

    dropdownService.$inject = ['$rootScope'];

    function dropdownService($rootScope) {  
        /* jshint validthis: true */
        var service = this;
        service.cleanSelectedDropdown = cleanSelectedDropdown;
        service.event_selectedModified = event_selectedModified;
        service.on_selectedRoleModified = on_selectedRoleModified;
        service.on_selectedQtySortModified = on_selectedQtySortModified;
        service.on_selectedCategorySearchModified = on_selectedCategorySearchModified;
        service.on_selectedDiscountTypeModified = on_selectedDiscountTypeModified;

        /* ========== Var ========== */
        var configEnum = Object.freeze({
					0: 'SELECTED_ROLE_MODIFIED',
                    1: 'SELECTED_QUANTITY_SORT_MODIFIED',
                    2: 'SELECTED_CATEGORY_SEARCH_MODIFIED',
                    3: 'SELECTED_DISCOUNT_TYPE_MODIFIED'
				});
        service.selectedDropdown = {};


        /* ========== Services ========== */
        

        /* ========== Public Function ========== */
        function cleanSelectedDropdown() {
            angular.copy({}, service.selectedDropdown);
        }

        function event_selectedModified(arrIndex) {
            $rootScope.$broadcast(configEnum[arrIndex]);
        }

        function on_selectedRoleModified($scope, handler) {
            $scope.$on(configEnum[0], function( /*event*/ ) {
                handler();
            });
        }

        function on_selectedQtySortModified($scope, handler) {
            $scope.$on(configEnum[1], function( /*event*/ ) {
                handler();
            });
        }

        function on_selectedCategorySearchModified($scope, handler) {
            $scope.$on(configEnum[2], function( /*event*/ ) {
                handler();
            });
        }

        function on_selectedDiscountTypeModified($scope, handler) {
            $scope.$on(configEnum[3], function( /*event*/ ) {
                handler();
            });
        }

        /* ========== Private Function ========== */
    }
})();