(function() {
  'use strict';

  angular.module('Core')
    .service('lokiService', lokiService);

    lokiService.$inject = ['eventsService', 'commonService'];
    function lokiService(eventsService, commonService) {
      var service = this;
      service.useCollection = useCollection;
      service.getDataBy = getDataBy;
      service.getDataFind = getDataFind;
      service.saveData = saveData;
      service.updateData = updateData;

      /* ======================================== Var ==================================================== */
      service.misc = {
        isDbLoaded: false
      };

      service.collections = {
        // collectionName: collectionObj
      };

      var db;
      var dbOptions = AppSettings.lokijs.dbOptions;

      var dbAdapter;

      /* ======================================== Services =============================================== */
      var cmnSvc = commonService;
      var eventsSvc = eventsService;

      /* ======================================== Public Methods ========================================= */

      // Query Examples: https://github.com/techfort/LokiJS/wiki/Query-Examples

      function updateData(collectionName, dataObj) {
        service.collections[collectionName].update(dataObj);
        saveDb();
      }

      function saveData(collectionName, data) {
        if(cmnSvc.getObjType(data) === 'array') {
          if(cmnSvc.isObjPresent(data)) {
            data.forEach(function(e){
              service.collections[collectionName].insert(e);
            });

            saveDb();
          }
        } else if (cmnSvc.getObjType(data) === 'object') {
          service.collections[collectionName].insert(data);
          saveDb();
        }
      }

      function getDataFind(collectionName, findObj) {
        if(cmnSvc.isObjPresent(findObj)) {
          return service.collections[collectionName].find(findObj);
        } else {
          return service.collections[collectionName].find({});
        }
      }

      function getDataBy(collectionName, byCol, byVal) {
        return service.collections[collectionName].by(byCol, byVal);
      }

      function useCollection(collectionName, indexArr, uniqueArr) {
        if(!cmnSvc.isObjPresent(collectionName)) {
          throw new Error('Collection name cannot be empty!');
        }

        if(!cmnSvc.isObjPresent(service.collections[collectionName])) {
          service.collections[collectionName] = db.getCollection(collectionName);
          if(cmnSvc.isObjPresent(service.collections[collectionName])) {
            return service.collections[collectionName];
          } else {
            var obj = {}

            if(cmnSvc.isObjPresent(indexArr)) {
              obj['indices'] = indexArr;
            }

            if(cmnSvc.isObjPresent(uniqueArr)) {
              obj['unique'] = uniqueArr;
            }

            if(cmnSvc.isObjPresent(obj)) {
              service.collections[collectionName] = db.addCollection(collectionName, obj);
            } else {
              service.collections[collectionName] = db.addCollection(collectionName);
            }

            return service.collections[collectionName];
            // c.name === 'collectionName'
          }
        }
      }

      /* ======================================== Private Methods ======================================== */
      function deleteDb() {
        dbAdapter.deleteDatabase(AppSettings.lokijs.dbName);
      }

      function saveDb() {
        db.saveDatabase();
      }

      function seedData() {
        var seedData = AppSettings.lokijs.seedData;
        if(cmnSvc.isObjPresent(seedData)) {
          seedData.forEach(function(e){
            var collection = useCollection(e.collectionName, e.indexArr);
            e.dataList.forEach(function(e1) {
              collection.insert(e1);
            });
          });
        }
      }

      function init() {
        if(!cmnSvc.isObjPresent(dbOptions)) {
          dbOptions = {};
        }

        // Using indexedadapter if db grow > 60mb
        // IndexedAdapter support up to 300mb
        // If become more, use LokiPartitioningAdapter together. Check out at the link below
        //
        //  More info: https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters
        dbOptions['adapter'] = new LokiIndexedAdapter(AppSettings.lokijs.dbName);
        dbAdapter = dbOptions['adapter'];

        db = new loki(AppSettings.lokijs.dbName, dbOptions);
        db.loadDatabase({}, function(result) {
          seedData();
          eventsSvc.event_stateModified(1);
          service.misc.isDbLoaded = true;
        });
      }

      init();
    }
})();
