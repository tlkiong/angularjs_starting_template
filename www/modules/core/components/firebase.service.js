(function() {

    'use strict';

    angular.module('Core')
        .service('firebaseService', firebaseService);

    firebaseService.$inject = ['sessionService', 'commonService'];

    // To use this service, add firebase as a npm module / bower module
    function firebaseService(sessionService, commonService) {
        var service = this;
        service.getFirebaseRef = getFirebaseRef;
        service.getUserProfile = getUserProfile;    // <= Assuming you have a user profile location
        service.getAllMyUsers = getAllMyUsers;
        service.simpleLogin = simpleLogin;
        service.createSimpleLoginUser = createSimpleLoginUser;
        service.isLoggedInToFirebase = isLoggedInToFirebase;
        service.resetForgetPassword = resetForgetPassword;
        service.logout = logout;
        service.listenToAuth = listenToAuth;
        service.stopListenToAuth = stopListenToAuth;
        // ******** The following are samples that you can follow *******
        // service.getMyBookings = getMyBookings;                   <= get all data at said location one shot. Has orderBy as well
        // service.listenToBookings = listenToBookings;             <= listen to any changes at a location URL
        // service.stopListenToBookings = stopListenToBookings;     <= stop listening to any changes at said location
        // service.placeBooking = placeBooking;                     <= create new data (will override any data at location URL - means the entire object will be replaced)
        // service.cancelMyBooking = cancelMyBooking;               <= update data at said location

        /* ======================================== Var ==================================================== */
        var firebaseUrl = '';
        var misc = {
            isListeningToAuth: false
        }

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */
        // function cancelMyBooking(uid, bookingKey) {
        //     var deferred = cmnSvc.$q.defer();

        //     getFirebaseRef('users/' + uid + '/myBookings/' + bookingKey).then(function(rs) {
        //         rs.update({
        //             'status': 'cancel'
        //         }, function(err){
        //             if(err) {
        //                 deferred.reject(err);
        //             } else {
        //                 deferred.resolve();
        //             }
        //         });
        //     });

        //     return deferred.promise;
        // }

        // function placeBooking(uid, bookingList) {
        //     var errorList = [];
        //     bookingList.forEach(function(element) {
        //         getFirebaseRef('users/' + uid + '/myBookings').then(function(rs) {
        //             rs.push({
        //                 dayTime: element.dayTime,
        //                 createdAt: Date.now(),
        //                 updatedAt: Date.now(),
        //                 status: 'going'
        //             }, function(error) {
        //                 if (error) {
        //                     errorList.push({
        //                         dayTime: error
        //                     })
        //                 } else {

        //                 }
        //             });
        //         });
        //         var d = new Date(element.dayTime);
        //         var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        //         getFirebaseRef('bookings/' + d2.getTime().toString() + '/' + d.getTime()).then(function(rs) {
        //             rs.set({
        //                 createdAt: Date.now(),
        //                 updatedAt: Date.now(),
        //                 userId: uid
        //             })
        //         })
        //     });
        // }

        // function stopListenToBookings() {
        //     getFirebaseRef('bookings').then(function(rs) {
        //         rs.off();
        //     });
        // }

        // function listenToBookings() {
        //     return getFirebaseRef('bookings');
        // }
        // 
        // ******* Once you call 'listenToBookings', the code can be as follow:
        // listenToBookings().then(function(rs) {
        //     // When anyone add a new time slot, this will be called
        //     rs.on("child_changed", function(snapshot) {
        //         /**
        //          * snapshot.key() refers to the day in epoch
        //          * snapshot.val() refers to the object of all the time of the day
        //          */
        //         processBookingDateTime(snapshot.key(), snapshot.val());
        //     });

        //     // Child Added is on first read or when anyone add a new day slot
        //     rs.on("child_added", function(snapshot) {
        //         /*
        //          * snapshot.key() refers to the day in epoch
        //          * snapshot.val() refers to the object of all the time of the day
        //          */
                 
        //         processBookingDateTime(snapshot.key(), snapshot.val());
        //     });

        //     // Check if there is any removed
        //     rs.on("child_removed", function(snapshot) {
        //         /**
        //          * snapshot.key() refers to the day in epoch
        //          * snapshot.val() refers to the object of all the time of the day
        //          */
        //         // processBookingDateTime(snapshot.key(), snapshot.val());
        //     });
        // });

        // function getMyBookings(uid) {
        //     var deferred = cmnSvc.$q.defer();

        //     getFirebaseRef('users/' + uid + '/myBookings').then(function(rs) {
        //         rs.orderByChild('dayTime').once('value', function(snap) {
        //             deferred.resolve(snap.val());
        //         }, function(err) {
        //             deferred.reject(err);
        //         });
        //     });

        //     return deferred.promise;
        // }

        function stopListenToAuth(callBackFn) {
            getFirebaseRef().then(function(rs) {
                if (misc.isListeningToAuth) {
                    misc.isListeningToAuth = false;
                }
                rs.offAuth(callBackFn);
            });
        }

        function listenToAuth(callBackFn) {
            getFirebaseRef().then(function(rs) {
                rs.onAuth(callBackFn);
            });
        }

        function logout() {
            getFirebaseRef().then(function(rs) {
                var abc = rs.unauth();
            });
        }

        function resetForgetPassword(emailAdd) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                rs.resetPassword({
                    email: emailAdd
                }, function(error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_USER":
                                deferred.reject("The specified user account does not exist.");
                                break;
                            default:
                                deferred.reject(error);
                        }
                    } else {
                        deferred.resolve("Password reset email sent successfully!");
                    }
                });
            });

            return deferred.promise;
        }

        function isLoggedInToFirebase() {
            var deferred = cmnSvc.$q.defer();

            if (sessionSvc.userData.tokenExpiry === undefined || sessionSvc.userData.tokenExpiry === null) {
                getFirebaseRef().then(function(rs) {
                    var authData = rs.getAuth();
                    if (authData === undefined || authData === null) {
                        deferred.reject();
                    } else {
                        service.getUserProfile(authData).then(function(rs) {
                            sessionSvc.userData.tokenExpiry = authData.expires;
                            sessionSvc.userData.uid = authData.uid;
                            sessionSvc.userData.fullName = rs.fullName;
                            sessionSvc.userData.role = rs.role;
                            sessionSvc.userData.emailAdd = rs.emailAdd;
                            sessionSvc.userData.isLoggedIn = true;
                            // sessionSvc.saveSession();
                            startListenAuth();
                            deferred.resolve(rs);
                        }, function(err) {
                            deferred.reject(err);
                        });
                    }
                });
            } else {
                if (Math.floor(Date.now() / 1000) < sessionSvc.userData.tokenExpiry) {
                    startListenAuth();
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }

            return deferred.promise;
        }

        function createSimpleLoginUser(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                rs.createUser({
                    email: userData.emailAdd,
                    password: userData.password
                }, function(error, userVal) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        userData.uid = userVal.uid;
                        createUserProfile(userData).then(function(rs) {
                            simpleLogin(userData);
                            deferred.resolve('User '+userData.fullName+' created successfully');
                        }, function(err) {
                            deferred.reject(err);
                        });

                    }
                });
            })

            return deferred.promise;
        }

        function simpleLogin(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                rs.authWithPassword({
                    email: userData.emailAdd,
                    password: userData.password
                }, function(error, authData) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        service.getUserProfile(authData).then(function(rs) {
                            sessionSvc.userData.tokenExpiry = authData.expires;
                            sessionSvc.userData.uid = authData.uid;
                            sessionSvc.userData.fullName = rs.fullName;
                            sessionSvc.userData.role = rs.role;
                            sessionSvc.userData.emailAdd = rs.emailAdd;
                            sessionSvc.userData.isLoggedIn = true;
                            // sessionSvc.saveSession();

                            startListenAuth();

                            deferred.resolve(rs);
                        }, function(err) {
                            deferred.reject(err);
                        });
                    }
                }, {
                    remember: "sessionOnly"
                });
            });

            return deferred.promise;
        }

        function getAllMyUsers() {
            var deferred = cmnSvc.$q.defer();
            
            getFirebaseRef('users').then(function(rs) {
                rs.once('value', function(snap) {
                    deferred.resolve(snap.val());
                }, function(err){
                    deferred.reject(err);
                });
            })

            return deferred.promise;
        }

        function getUserProfile(authData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef('users/' + authData.uid).then(function(rs) {
                rs.once('value', function(snap) {
                    deferred.resolve(snap.val());
                }, function(err){
                    deferred.reject(err);
                });
            })

            return deferred.promise;
        }

        function getFirebaseRef(path) {
            var deferred = cmnSvc.$q.defer();

            if (path == undefined || path == null || path.length <= 0) {
                deferred.resolve(new Firebase(firebaseUrl));
            } else {
                deferred.resolve(new Firebase(firebaseUrl + path));
            }

            return deferred.promise;
        }

        /* ======================================== Private Methods ======================================== */
        function startListenAuth() {
            if (!misc.isListeningToAuth) {
                misc.isListeningToAuth = true;
                listenToAuth(watchLoggedInState);
            }
        }

        function watchLoggedInState(authData) {
            if (authData) {
                // console.log("User " + authData.uid + " is logged in with " + authData.provider);
                sessionSvc.userData.isLoggedIn = true;
            } else {
                // console.log("User is logged out");
                stopListenToAuth(function() {});
                sessionSvc.resetUserData();
                sessionSvc.clearSession();
                cmnSvc.goToPage(undefined, undefined, true);
            }
        }

        function createUserProfile(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef('users/' + userData.uid).then(function(rs) {
                rs.set({
                    emailAdd: userData.emailAdd,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    fullName: userData.fullName,
                    dateOfBirth: userData.dateOfBirth
                }, function(error) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve('user created successfully');
                    }
                });
            })

            return deferred.promise;
        }

        function init() {

        }

        init();
    }
})();
