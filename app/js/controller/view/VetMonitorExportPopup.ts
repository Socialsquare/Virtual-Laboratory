import ko = require('knockout');
import _ = require('lodash');
import $ = require('jquery');
import DataHelper = require('utils/DataHelper');
import vetMonitorLog = require('service/VetMonitorLog');
import VetMonitorLogItem = require('model/type/VetMonitorLogItem');
import gameState = require('model/GameState');


// FIXME: logs could have a predefined limit and expire time,
// FIXME: hence logIds will have to be updated accordingly
class VetMonitorExportPopup {

    public maxLogId: number = null;
    public currLogId: number = null;
    public currLabelLogId: KnockoutObservable<number>;
    public btnLabelInputVal: KnockoutObservable<string>;
    public logIds: KnockoutObservableArray<number>;
    public logButtonsToggle: KnockoutObservable<boolean>;
    public isBtnLabelFormVisible: KnockoutObservable<boolean>;
    public shouldShowExportPopup: KnockoutObservable<boolean>;
    public dataToggle: KnockoutObservable<boolean>;
    public backButtonToggle: KnockoutObservable<boolean>;
    public monitorExportPopupToggle: KnockoutObservable<boolean>;
    public csvData: KnockoutObservable<string>;
    private _toggleSubscription = null;
    
    constructor(params) {
        // template 'components/vetmonitor-export-popup.ko'
        console.log("VetMonitorExportPopup.constructor()");

        this.maxLogId = null;
        this.currLogId = null;

        this.shouldShowExportPopup = params.shouldShowExportPopup;
        this.logButtonsToggle = ko.observable(true);
        this.dataToggle = ko.observable(false);
        this.backButtonToggle = ko.observable(false);
        this.maxLogId = vetMonitorLog.getCurrentLogId();
        this.logIds = ko.observableArray(_.range(1, this.maxLogId + 1));
        this.csvData = ko.observable('');
        this.currLabelLogId = ko.observable(null);
        this.isBtnLabelFormVisible = ko.observable(false);
        this.btnLabelInputVal = ko.observable('');
        
        this._toggleSubscription = 
            this.shouldShowExportPopup.subscribe((newval: boolean)=>{
            this.updateLogIds();
        });

        ko.rebind(this);
    }

    show() {
        console.log("VetMonitorExportPopup.show()"+ this.shouldShowExportPopup());
        if (this.shouldShowExportPopup()) {
            return;
        }
        this.showLogButtons();
        this.shouldShowExportPopup(true);
    }

    hide() {
        console.log("VetMonitorExportPopup.hide()");
        this.showLogButtons();
        this.shouldShowExportPopup(false);
    }
    
    dispose(){
        console.log("VetMonitorExportPopup.dispose()");
        this._toggleSubscription.dispose();
    }
    
    onBackButtonClick() {
        this.showLogButtons();
    }

    showDataByLogId(logId: number) {
        console.log("VetMonitorExportPopup.showDataByLogId(" + logId + ")");
        this.logButtonsToggle(false);
        this.dataToggle(true);
        this.backButtonToggle(true);
        vetMonitorLog.fetchByLogId(logId, (counter, result) => {
            var headers = ['time', 'blood sugar', 'heart rate', 'GIR'];
            var parsed = [];
            _.each(result, (val: VetMonitorLogItem) => {
                var line = [val.time, val.gl, val.hr, val.gir];
                parsed.push(line);
            });
            this.csvData(DataHelper.toCSV(parsed, headers));
            this.backButtonToggle(true);
            this.dataToggle(true);
            $('#vetMonitorExportCsvData').scrollTop(0);
        });
    }
    
    showLogBtnLabelForm(logId: number) {
        this.currLabelLogId(logId);
        this.isBtnLabelFormVisible(true);
        this.logButtonsToggle(false);
        this.dataToggle(false);
        this.backButtonToggle(false);
    }
    
    getLogBtnLabel(logId: number) {
        var label = vetMonitorLog.getLabelForLogId(logId);
        if (label) {
            return label;
        }
        return String(logId);
    }
    
    setBtnLabel() {
        var valStr: string = _.escape(this.btnLabelInputVal().substring(0, 20).trim());
        vetMonitorLog.setLabelForLogId(this.currLabelLogId(), valStr);
        this.btnLabelInputVal('');
        this.isBtnLabelFormVisible(false);
        this.currLabelLogId(null);
        this.updateLogIds();
        this.dataToggle(false);
        this.backButtonToggle(false);
        this.logButtonsToggle(true);
        this.logIds.valueHasMutated();
    }

    public updateLogIds = () => {
        this.maxLogId = vetMonitorLog.getCurrentLogId();
        this.logIds.removeAll();
        _.map(_.range(1, this.maxLogId + 1),
              (item:number)=>{ this.logIds.push(item); });
        this.logIds.reverse();
    }

    showLogButtons() {
        this.updateLogIds();
        this.csvData('');
        this.logButtonsToggle(true);
        this.dataToggle(false);
        this.backButtonToggle(false);
    }
}
export = VetMonitorExportPopup;
