(function() {

    'use strict';

    angular.module('Core')
        .provider('translationHelper', translationHelperProvider);

    translationHelperProvider.$inject = [];

    function translationHelperProvider() {
        this.$get = TranslationHelper;

        TranslationHelper.$inject = [];
        
        function TranslationHelper() {
            var service = {
                getTranslationType: getTranslationType
            };

            /* ======================================== Var ==================================================== */
            var translationObj = {
                en: getEnglishObj()
            }

            /* ======================================== Public Methods ========================================= */
            function getTranslationType(type) {
                if(!(type === undefined || type === null)
                    && (Object.prototype.toString.call(type) === '[object String]')
                    && (type.length > 0)
                    && !(translationObj[type] === undefined || translationObj[type] === null)) {
                    return translationObj[type];
                } else {
                    throw new Error (type + ' is not a valid translation!');
                }
            }

            /* ======================================== Private Methods ======================================== */
            function getEnglishObj() {
                return {
                    // 'SAMPLE': 'Hohoho'
                }
            }

            return service;
        }
    }

})();