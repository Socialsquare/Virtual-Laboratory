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


/*
    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
*/
class IndexedDbService {
    
    protected dbName: string = "dbName";
    protected dbVersion: number = 2;
    protected storeName: string = "storeName";
    private _db: JQueryDeferred<any> = null;
    
    protected indexes = {
        "created": ["created", {unique: true}]
    };

    constructor () {

        if (!window.indexedDB) {
            var msg = "Your browser doesn't support a stable version of IndexedDB! Please upgrade your browser.";
            window.alert(msg);
        }
        
        this._db = $.Deferred();
        var DBOpenRequest = window.indexedDB.open(this.dbName, this.dbVersion);
        DBOpenRequest.onerror = (event) => {
            console.error("IndexedDB open error!");
            throw "IndexedDB error!";
        };


        DBOpenRequest.onsuccess = (event) => {
            console.info("IndexedDB open success!");
            // FIXME: shouldn't I use this.result or event.result to avoid garbage collection
            var db = DBOpenRequest.result;
            this._db.resolve(db);
        };

        //db.deleteObjectStore(this.storeName);
        DBOpenRequest.onupgradeneeded = (event) => {
            console.log("IndexedDB onupgradeneeded()")
            //this.db = event.target.result;
            var db = event.currentTarget.result;
            var config = {
                autoIncrement: true,
                keyPath : this.storeName
            };
            if (!db.objectStoreNames.contains(this.storeName)) {
                console.log("upgrade really needed");
                var objectStore = db.createObjectStore(this.storeName, config);
            
                for(var idxName in this.indexes) {
                    objectStore.createIndex(idxName, this.indexes[idxName][0],
                        this.indexes[idxName][1]);
                }
            }
            this._db.resolve(db);
        };
    }

    protected getObjectStore() {
        var ret = $.Deferred();
        this._db.done((db) => {
            var transaction = db.transaction([this.storeName], "readwrite");
            transaction.oncomplete = () => {
                //console.log('Transaction completed: database modification finished.');
            };
            transaction.onerror = () => {
                console.error('Transaction not opened due to error: ' + transaction.error);
            };
            ret.resolve(transaction.objectStore(this.storeName));
        });
        return ret;
    }
    
    public clearObjectStore() {
        var storeName = this.storeName;
        this.getObjectStore().done((store)=>{
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
        this.getObjectStore().done((store) =>{
            _.each(chunks, (item) => {
                item.created = new Date();
                var objectStoreRequest = store.add(item);
            });
        });
    }

    public fetch(cb, limit) {
        var ret = [];
        return this.getObjectStore().done((store) =>{
            var counter = 0;
            var req = store.openCursor().onsuccess = (event) => {
                // this is called iteratively!
                var cursor = event.target.result;
                if(cursor && (counter < limit)) {
                    ret.push(cursor.value);
                    counter++;
                    cursor.continue();
                } else {
                    // result undefined so it's either empty set, end of cursor,
                    // or above limit
                    return cb(counter, ret);
                }
            }
        });
    }
    
    public getCount(cb) {
        this.getObjectStore().done((store) =>{
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