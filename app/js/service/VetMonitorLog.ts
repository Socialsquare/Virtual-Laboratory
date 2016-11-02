import ko = require('knockout');
import _ = require('lodash');
import $ = require('jquery');
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
        const logId = this.getCurrentLogId()

        // If the current logid doesn't have a label we set it to the current time
        const label = this.getLabelForLogId(logId)
        if (!label) {
            const now = new Date()
            const newLabel = now.toLocaleTimeString('da').replace(/\./g, ':')
            this.setLabelForLogId(logId, newLabel)
        }

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
        sessionStorage.setItem('vetMonitorLogLabels', JSON.stringify({}));
    }

    public getLabelForLogId(logId: number) {
        var logLabelsStr: string = sessionStorage.getItem('vetMonitorLogLabels');
        var logLabels: any = JSON.parse(logLabelsStr);
        if (!$.isEmptyObject(logLabels)) {
            return logLabels[logId] || null;
        }
        return null;
    }

    public setLabelForLogId(logId: number, logLabel: string) {
        var logLabelsStr: string = sessionStorage.getItem('vetMonitorLogLabels');
        var logLabels: any = JSON.parse(logLabelsStr);
        console.log("setLabelForLogId("+ logId + ", " + logLabel +")");
        if ($.isEmptyObject(logLabels)) {
            logLabels = {};
        }
        logLabels[String(logId)] = logLabel;
        sessionStorage.setItem('vetMonitorLogLabels', JSON.stringify(logLabels));
    }
}

export = new VetMonitorLogService();