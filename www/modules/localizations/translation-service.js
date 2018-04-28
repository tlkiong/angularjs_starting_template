(function() {
  'use strict';

  angular.module('starter.services-utils')
    .service('translationService', translationService);

    translationService.$inject = ['$translate'];
    function translationService($translate) {
      var service = this;
      service.getTranslationLangList = getTranslationLangList;
      service.getPreferredLang = getPreferredLang;
      service.getTranslationType = getTranslationType;
      service.getTranslationObj = getTranslationObj;
      service.setPreferredLang = setPreferredLang;

      /* ======================================== Var ==================================================== */
      service.misc = {};

      var translationObj = {}
      var translationLangList = [];
      var preferredLang = '';

      /* ======================================== Services =============================================== */
      var angularTranslateSvc = $translate;

      /* ======================================== Public Methods ========================================= */
      function setPreferredLang() {
        angularTranslateSvc.use(service.getPreferredLang());
      }

      function getTranslationObj(){
        return new Promise(function(resolve, reject){
          if(Object.keys(translationObj).length > 0) {
            resolve(translationObj);
          } else {
            getTranslationFile(function(csvTxt){
              setTranslationObj(parseCsvStrToArr(csvTxt), function(){
                resolve(translationObj);
              });
            });
          }
        });
      }

      function getTranslationLangList() {
        return new Promise(function(resolve, reject){
          if(translationLangList && translationLangList.length > 0) {
            resolve(translationLangList);
          } else {
            getTranslationFile(function(csvTxt){
              setTranslationObj(parseCsvStrToArr(csvTxt), function(){
                resolve(translationLangList);
              });
            });
          }
        });
      }

      function getPreferredLang() {
        return preferredLang;
      }

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
      function setTranslationObj(csvDataList, cbFn){
        var tempObj = {};

        csvDataList.forEach(function(dataObj){
          for(var k in dataObj){
            if(dataObj.hasOwnProperty(k)) {
              if(dataObj['key'].toLowerCase() === 'is_preferred') {
                if(k.toLowerCase() !== 'key' && dataObj[k] === 'yes') {
                  preferredLang = k;
                }
              } else {
                if(k.toLowerCase() !== 'key') {
                  tempObj[k] = true;
                  if(translationObj[k] === null || translationObj[k] === undefined) {
                    translationObj[k] = {};
                  }

                  translationObj[k][dataObj['key']] = dataObj[k];
                }
              }
            }
          }
        });

        translationLangList = Object.keys(tempObj);

        cbFn()
      }

      function parseCsvStrToArr(csvStr){
        var csvDataRowInArr = csvStr.split('\n');
        // First row is header.
        var headerList = csvDataRowInArr.shift().split(',');

        var csvDataInArrOfObj = [];

        csvDataRowInArr.forEach(function(dataRow){
          var dataPerRow = dataRow.split(',');
          var tempObj = {};

          headerList.forEach(function(headerTxt,i){
            headerTxt = headerTxt.trim();
            tempObj[headerTxt] = (dataPerRow[i]) ? dataPerRow[i] : '';
          });

          csvDataInArrOfObj.push(tempObj);
        });

        return csvDataInArrOfObj;
      }

      function getTranslationFile(cbFn){
        var url = '';
        if(ionic.Platform.isAndroid()){
          url = '/android_asset/www/';
        }

        url += 'js/utils/data/translations.csv';
        
        // Vanilla AJAX request to get file
        var xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            cbFn(this.responseText);
          }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
      }

      function init(){
        // 
      }

      init();
    }
})();
