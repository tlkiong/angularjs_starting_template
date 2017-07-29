(function() {
  'use strict';

  angular.module('Core')
    .service('sendgridService', sendgridService);

    sendgridService.$inject = ['$http', 'commonService'];
    function sendgridService($http, commonService) {
      var service = this;
      service.sendEmail = sendEmail;

      /* ======================================== Var ==================================================== */
      service.misc = {

      }

      /* ======================================== Services =============================================== */
      var cmnSvc = commonService;
      var httpSvc = $http;

      /* ======================================== Public Methods ========================================= */
      /**
       * Refer to https://developers.sparkpost.com/api/ for information on header
       *
       */
      function sendEmail(dataObj) {
        var deferred = cmnSvc.$q.defer();

        if(!cmnSvc.isObjPresent(dataObj)) {
          deferred.reject('emailObj cannot be empty!');
        }

        if(!cmnSvc.isObjPresent(dataObj.fromName)) {
          deferred.reject('emailObj fromName cannot be empty!');
        }

        if(!cmnSvc.isObjPresent(dataObj.subjectTxt)) {
          deferred.reject('emailObj subjectTxt cannot be empty!');
        }

        if(!cmnSvc.isObjPresent(dataObj.contentInHtml)) {
          deferred.reject('emailObj contentInHtml cannot be empty!');
        }

        var headerObj = {
          'Authorization': 'Bearer ' + AppSettings.sendgridConfig.apiKey,
          'Content-Type': 'application/json',
        };

        // Docs are at: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
        // var obj = {
        //   personalizations: [{ // required!
        //     to: [{ // required!
        //       email: 'Lmartin@fredastaire.com', // required!
        //       name: 'Laura'
        //     }],
        //     cc: [{
        //       email: 'kiong90@gmail.com',
        //       name: 'Kiong'
        //     }]
        //   }],
        //   from: { // required!
        //     email: 'mobile-app@gmail.com', // required!
        //     name: dataObj.fromName
        //   },
        //   subject: dataObj.subjectTxt,
        //   content: [{ // required!
        //     type: 'text/html', // required!
        //     value: dataObj.contentInHtml // required!
        //   }]
        // }

        var obj = {
          personalizations: [{ // required!
            to: [{
              email: 'kiong90@gmail.com',
              name: 'Kiong'
            }]
          }],
          from: { // required!
            email: 'mobile-app@gmail.com', // required!
            name: dataObj.fromName
          },
          subject: dataObj.subjectTxt,
          content: [{ // required!
            type: 'text/html', // required!
            value: dataObj.contentInHtml // required!
          }]
        }

        console.log('obj: ',obj);

        $http({
          method: 'POST',
          url: AppSettings.sendgridConfig.baseUrl + '/mail/send',
          dataType: 'json',
          headers: headerObj,
          data: obj
        }).then(function(rs) {
          deferred.resolve(rs);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      /* ======================================== Private Methods ======================================== */
      function init() {

      }

      init();
    }
})();
