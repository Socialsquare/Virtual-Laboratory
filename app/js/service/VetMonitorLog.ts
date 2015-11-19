import ko = require('knockout');
import _ = require('lodash');
import VetMonitorLogItem = require('model/type/VetMonitorLogItem');
import IndexedDbService = require('service/IndexedDb');


class VetMonitorLogService extends IndexedDbService {
    protected static dbName: string = "vetMonitorLogDb";
    protected static dbVersion: number = 19;
    protected static storeName: string = "mousedata";
    protected static indexes: any = {
        "created": ["created", {unique: true}],
        "logId": ["logId", {unique: false}],
    };

    constructor() {
        super();
    }

    public saveChunks(chunks: any[]) {
        this.getObjectStore().done((store: any)=>{
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
        console.log("fetchByLogId(" + logId +")");
        var ret = [];
        return this.getObjectStore().done((store: any) => {
            var counter = 0;
            var singleKeyRange = IDBKeyRange.only(logId);
            var index = store.index('logId');
            var req = index.openCursor(singleKeyRange);
            req.onsuccess = (event: any) => {
                // this is called iteratively!
                var cursor = event.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    counter++;
                    cursor.continue();
                } else {
                    return cb(counter, ret);
                }
            };
            req.onerror = (event: any)=> {
                console.log("fetchByLogId error");
                console.log(event);
            }
        });
    }

    public clear() {
        this.clearObjectStore();
        sessionStorage.setItem('vetMonitorLogId', String(0));
    }
}

export = new VetMonitorLogService();