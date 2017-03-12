(function() {
  'use strict';

  angular.module('Core')
      .service('firebaseService', firebaseService);

  firebaseService.$inject = ['commonService'];

  // To use this service, add firebase as a npm module / bower module
  function firebaseService(commonService) {
    var service = this;
    service.offAllFirebaseListener = offAllFirebaseListener;
    service.createFbaseUserWithEmailAndPassword = createFbaseUserWithEmailAndPassword;
    service.signInWithEmailAndPassword = signInWithEmailAndPassword;
    service.signMeOut = signMeOut;
    service.getCurrentSignedInUser = getCurrentSignedInUser;
    service.getUserProfile = getUserProfile;
    // service.getCities = getCities;
    // service.listenToGetAddedChannelMessages = listenToGetAddedChannelMessages;

    /* ======================================== Var ==================================================== */
    var ENV = 'prod'; // Set the env here. Options are the keys in 'fbaseEnvConfig' below.

    var fbaseEnvConfig = {
      dev: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        storageBucket: '',
        messagingSenderId: ''
      },
      prod: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        storageBucket: '',
        messagingSenderId: ''
      }
    }

    var fbaseConfig = {
      // apiKey: '',
      // authDomain: '',
      // databaseURL: ''
    };
    var fbaseDb; // This is under 'init' function
    var allFbaseListener = [
      // {
      //   ref: fbaseDb.ref('url'),
      //   eventType: eg: 'child_added',
      //   callbackFn: call back function
      // }
    ];

    /* ======================================== Services =============================================== */
    var cmnSvc = commonService;

    /* ======================================== Public Methods ========================================= */
    /* To use this:
    *      fbaseSvc.listenToGetAddedChannelMessages(vm.misc.channelId,  function(snapshot, prevChildKey) {
    *        var val = snapshot.val();
    *     });
    */
    function listenToGetAddedChannelMessages(channelId, callbackFn) {
      var fbaseRef = fbaseDb.ref('messages/' + channelId);
      var fbaseEventType = 'child_added';
      
      fbaseRef.on(fbaseEventType, callbackFn);

      allFbaseListener.push({
        ref: fbaseRef,
        eventType: fbaseEventType,
        callbackFn: callbackFn
      });
    }

    function getCities() {
      var deferred = cmnSvc.$q.defer();

      fbaseDb.ref('cities/').once('value')
        .then(function(snapshot) {
          var val = snapshot.val();
          deferred.resolve(val);
        }, function(err) {
          deferred.reject(err);
        })

      return deferred.promise;
    }

    // TODO: UD of user profile
    function getUserProfile(userId) {
      var deferred = cmnSvc.$q.defer();

      fbaseDb.ref('/users/' + userId).once('value')
        .then(function(snapshot) {
          var val = snapshot.val();
          deferred.resolve(val);
        }, function(err) {
          deferred.reject(err);
        })

      return deferred.promise;
    }

    /**
     * To use:
     *   getCurrentSignedInUser().onAuthStateChanged(function(user) {
     *       if(user) {
     *         // User is signed in
     *       } else {
     *         // No user is signed in
     *       }
     *    });
     */
    function getCurrentSignedInUser(returnListener) {
      if(cmnSvc.isObjPresent(returnListener)) {
        return firebase.auth();
      } else {
        return firebase.auth().currentUser;
      }
    }

    function signMeOut() {
      var deferred = cmnSvc.$q.defer();

      firebase.auth().signOut()
        .then(function(rs) {
          deferred.resolve(rs);
        }, function(err) {
          /**
           * err contains:
           *   err.code
           *   err.message
           */
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function signInWithEmailAndPassword(userData) {
      var deferred = cmnSvc.$q.defer();

      if(userData.password.length < 6) {
        deferred.reject('password must be at least 6 characters');
      }

      // Password MUST be at least 6 characters
      firebase.auth().signInWithEmailAndPassword(userData.emailAdd, userData.password)
        .then(function(rs){
          getUserProfile(rs.uid).then(function(rs1){
            rs1['uid'] = rs.uid;
            deferred.resolve(rs1);
          }, function(err) {
            deferred.reject(err);
          });
        }).catch(function(err) {
          /**
           * err contains:
           *   err.code
           *   err.message
           */
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function createFbaseUserWithEmailAndPassword(userData) {
      var deferred = cmnSvc.$q.defer();

      // If user is successfully created, it will automatically be signed in
      firebase.auth().createUserWithEmailAndPassword(userData.emailAdd, userData.password)
        .then(function(rs){
          /**
           * rs contains:
           *   rs.email
           *   rs.refreshToken
           *   rs.uid
           */
          userData.uid = rs.uid;
          createUserProfile(userData).then(function(rs) {
            deferred.resolve(rs);
          }, function(err) {
            deferred.reject(err);
          });
        }).catch(function(err) {
          /**
           * err contains:
           *   err.code
           *   err.message
           */
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function offAllFirebaseListener() {
      while(allFbaseListener.length > 0) {
        var ele = allFbaseListener.pop();
        ele.ref.off(ele.eventType, ele.callbackFn);
      }
    }

    /* ======================================== Private Methods ======================================== */
    function createUserProfile(userData) {
      var deferred = cmnSvc.$q.defer();

      fbaseDb.ref('users/' + userData.uid).set({
          emailAdd: userData.emailAdd,
          firstName: userData.firstName,
          lastName: userData.lastName,
          nickname: userData.nickname,
          dateOfBirth: userData.dateOfBirth, // Epoch time in ms
          address: userData.address,
          contactNumber: userData.contactNumber,
          role: userData.role,
          img: userData.img,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          uid: userData.uid
        })
        .then(function(rs) {
          deferred.resolve(userData.uid);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function init() {
      fbaseConfig = fbaseEnvConfig[ENV];

      if(!cmnSvc.isObjPresent(fbaseConfig)) {
        throw new Error('Firebase config CANNOT be empty.');
      }

      firebase.initializeApp(fbaseConfig);
      fbaseDb = firebase.database();
      firebase.auth();
    }

    init();
  }
})();