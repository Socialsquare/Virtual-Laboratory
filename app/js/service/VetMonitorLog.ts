import ko = require('knockout');
import _ = require('lodash');
import VetMonitorLogItem = require('model/type/VetMonitorLogItem');
import IndexedDbService = require('service/IndexedDb');

// FIXME: fetchByLogId needs fixing to use index!
// FIXME: perhaps we should not keep currLogId in sessionStorage
// FIXME: but rather get unique/distinct logIds from db?

class VetMonitorLogService extends IndexedDbService {
    protected dbName: string = "vetMonitorLogDb";
    protected dbVersion: number = 14;
    protected storeName: string = "mousedata";
    protected indexes = {
        "created": ["created", {unique: true}],
        "logId": ["logId", {unique: false}],
    };

    constructor() {
        super();
    }

    public saveChunks(chunks: any[]) {
        this.getObjectStore().done((store)=>{
            _.each(chunks, (item) => {
                item.created = new Date();
                item.logId = this.getCurrentLogId();
                var objectStoreRequest = store.add(item);
            });
        });
    }

    public updateLogId(): void {
        var currVal = Number(sessionStorage.getItem('vetMonitorLogId'));
        if (currVal) {
            sessionStorage.setItem('vetMonitorLogId', String(currVal + 1));
        } else {
            sessionStorage.setItem('vetMonitorLogId', String(1));
        }
    }

    
    public getCurrentLogId(): number {
        if (!<boolean><any>sessionStorage.getItem('vetMonitorLogId')) {
            this.updateLogId();
        }
        return Number(sessionStorage.getItem('vetMonitorLogId'));
    }

    public fetchByLogId(logId:number, cb) {
        var ret = [];
        return this.getObjectStore().done((store) => {
            var counter = 0;
            var req = store.openCursor().onsuccess = (event) => {
                // this is called iteratively!
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.logId === logId){
                        ret.push(cursor.value);
                        counter++;
                    }
                    cursor.continue();
                } else {
                    return cb(counter, ret);
                }
            }
        });
    }
    
    /*
    FIXME: fix this method to work!
    public fetchByLogId(logId:number, cb) {
        console.log("fetchByLogId");
        var ret = [];
        return this.getObjectStore().done((store) => {
            console.log("getObjectStore.done");
            var index = store.index('logId');
            var counter = 0;
            var req = index.openCursor(IDBKeyRange.only(logId))
            .onsuccess = (event) => {
                // this is called iteratively!
                var cursor = event.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    counter++;
                    cursor.continue();
                } else {
                    return cb(counter, ret);
                }
            }
        });
    }
    */
    
    public clear() {
        this.clearObjectStore();
        sessionStorage.setItem('vetMonitorLogId', String(0));
    }
}

export = new VetMonitorLogService();