(function(){
  'use strict';

  angular.module('starter.services-utils')
    .factory('angularTranslateCustomLoader', angularTranslateCustomLoader);

  angularTranslateCustomLoader.$inject = ['translationService'];

  function angularTranslateCustomLoader(translationService){
    var langObj = {};

    return function (options) {
      return new Promise(function(resolve, reject){
        if(Object.keys(langObj).length > 0){
          resolve(getTranslationLangObj(options.key));
        } else {
          translationService.getTranslationObj()
            .then(function(rs){
              if(rs && Object.keys(rs).length > 0) {
                langObj = rs;
                resolve(getTranslationLangObj(options.key));
              } else {
                reject(options.key); // Must have this: https://angular-translate.github.io/docs/#/guide/13_custom-loaders#customer-loaders_building-a-custom-loader-service
              }
            }, function(er){
              reject(options.key); // Must have this: https://angular-translate.github.io/docs/#/guide/13_custom-loaders#customer-loaders_building-a-custom-loader-service
            });
        }
      });
    }

    function getTranslationLangObj(langKey){
      return langObj[langKey];
    }
  }
})();