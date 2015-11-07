import $ = require('jquery');
import _ = require('lodash');


interface Window {
    indexedDB: any; mozIndexedDB: any; webkitIndexedDB: any; msIndexedDB: any;
    IDBTransaction: any; webkitIDBTransaction: any; msIDBTransaction: any;
    IDBKeyRange: any; webkitIDBKeyRange: any; msIDBKeyRange: any;
    alert: any;
}

declare var window: Window;

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


interface IndexedDbServiceBaseType {
    dbName: string;
    dbVersion: number;
    storeName: string;
    indexes: any;
}

/*
    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
*/
class IndexedDbService {
    
    protected static dbName: string = "dbName";
    protected static dbVersion: number = 2;
    protected static storeName: string = "storeName";
    protected static indexes: any = {
        "created": ["created", {unique: true}],
        "logId": ["logId", {unique: false}]
    };
    
    protected _db: JQueryDeferred<any> = null;

    constructor () {
        var childClass = <IndexedDbServiceBaseType><any>this["constructor"];
        var storeName = childClass.storeName;
        var dbName = childClass.dbName;
        var dbVersion = childClass.dbVersion;
        var indexes = childClass.indexes
        var storeConfig = {
            autoIncrement: true,
            keyPath : storeName
        };
        
        console.log("IndexedDbService.dbName: " + dbName);
        console.log("IndexedDbService.dbVersion: " + dbVersion);
        console.log("IndexedDbService.dbVersion: " + storeName);
        console.log("IndexedDbService.indexes: ");
        console.log(indexes);

        if (!window.indexedDB) {
            var msg = "Your browser doesn't support a stable version of IndexedDB!" +
            " Please upgrade your browser.";
            window.alert(msg);
        }
        
        this._db = $.Deferred();
        var DBOpenRequest = window.indexedDB.open(dbName, dbVersion);
        DBOpenRequest.onerror = (event) => {
            console.error("IndexedDB open error!");
            console.log(event);
            throw "IndexedDB error!";
        };
        DBOpenRequest.onblocked = (event) => {
            console.error("IndexedDB blocked!");
            console.log(event);
            throw "IndexedDB blocked!";
        };


        DBOpenRequest.onsuccess = (event) => {
            console.info("IndexedDB open success!");
            // FIXME: shouldn't I use this.result or event.result to avoid garbage collection
            var db = DBOpenRequest.result;
            this._db.resolve(db);
        };

        DBOpenRequest.onupgradeneeded = (event) => {
            console.log("IndexedDB onupgradeneeded()")
            var db = event.currentTarget.result;
            if (db.objectStoreNames.contains(storeName)) {
                console.log("already has store: " + storeName + " ;deleting it...");
                db.deleteObjectStore(storeName);
                console.log("deleted!");
            }
            var objectStore = db.createObjectStore(storeName, storeConfig);
            for(var idxName in indexes) {
                console.log("objectStore.createIndex: " + idxName);
                objectStore.createIndex(
                    idxName,
                    indexes[idxName][0],
                    indexes[idxName][1]
                );
            }
            db.onversionchange = (event: any) => {
                var msg = 'a database change has occurred; you should refresh this' +
                'browser window, or close it down and use the other open version of' +
                'this application, wherever it exists.';
                alert(msg);
            };
            this._db.resolve(db);
        };
    }

    protected getObjectStore() {
        var childClass = <IndexedDbServiceBaseType><any>this["constructor"];
        var storeName = childClass.storeName;
        var ret = $.Deferred();
        this._db.done((db) => {
            var transaction = db.transaction([storeName], "readwrite");
            transaction.oncomplete = () => {
                //console.log('Transaction completed: database modification finished.');
            };
            transaction.onerror = () => {
                console.error('Transaction not opened due to error: ' + transaction.error);
            };
            ret.resolve(transaction.objectStore(storeName));
        });
        return ret;
    }
    
    public clearObjectStore() {
        var childClass = <IndexedDbServiceBaseType><any>this["constructor"];
        var storeName = childClass.storeName;
        this.getObjectStore().done((store: any)=>{
            var req = store.clear();
            req.onsuccess = (event) => {
                console.log("store: " + storeName + " cleared");
            };
            req.onerror = (event) => {
                console.error("clearObjectStore:", event.target.errorCode);
            };
        });
    }

    public saveChunks(chunks: any[]) {
        this.getObjectStore().done((store: any) =>{
            _.each(chunks, (item) => {
                item.created = new Date();
                var objectStoreRequest = store.add(item);
            });
        });
    }

    public fetch(cb, limit) {
        var ret = [];
        return this.getObjectStore().done((store: any) =>{
            var counter = 0;
            var req = store.openCursor().onsuccess = (event) => {
                // this is called iteratively!
                var cursor = event.target.result;
                if(cursor && (counter < limit)) {
                    ret.push(cursor.value);
                    counter++;
                    cursor.continue();
                } else {
                    // if result is undefined it is because 
                    // it's either empty set, end of cursor, or above limit.
                    return cb(counter, ret);
                }
            }
        });
    }
    
    public getCount(cb) {
        this.getObjectStore().done((store: any) =>{
            var req = store.count();
            var ret = 0;
            req.onsuccess = (evt) => {
                ret = evt.target.result;
                return cb(ret)
            }
        });
    }
}
export = IndexedDbService;