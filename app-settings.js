// @if ENV = "DEV"

/**
 * lokijs.seedData = [{
 *   collectionName: ''
 *   dataList:[{
 *     '': ''
 *   }, {...}, ...]
 * }, {...}, ...]
 */

// @endif

AppSettings = {
  // @if ENV == 'DEV'
  env: 'dev',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  lokijs: {
    dbName: '<app name>-dev',
    dbOptions: {
      autosave: true,
      autosaveInterval: 1000 // 10 seconds
    },
    seedData: []
  },
  // @endif

  // @if ENV == 'TEST'
  env: 'test',
  // @endif

  // @if ENV == 'PROD'
  env: 'prod',
  // Remove the below firebase config once the prod config works as its the dev's.
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  lokijs: {
    dbName: '<app name>-prod',
    dbOptions: {
      autosave: true,
      autosaveInterval: 1000 // 10 seconds
    },
    seedData: []
  }
  // @endif
}
