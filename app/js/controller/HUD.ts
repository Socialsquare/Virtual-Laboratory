import ko = require('knockout');
import _ = require('lodash');
import utils = require('utils/utils');
import ImageHelper = require('utils/ImageHelper');

class HUD {
    private simulationIntervalId: number = null;
    private simulationInterval: number = 1000;  // millisecond
    private firstImgNo = 0;
    private lastImgNo = 71;
    
    public clockImgNo: KnockoutObservable<number>;
    public clockImageSrc: KnockoutComputed<string>;
    public digitalClockCountdown: KnockoutObservable<number>;
    public digitalClockText: KnockoutComputed<string>;
    public showTimePassing: KnockoutObservable<boolean>;

    constructor() {
        this.clockImgNo = ko.observable(0);
        this.digitalClockCountdown = ko.observable(null);
        this.clockImageSrc = ko.pureComputed(()=>{
            return ImageHelper.timeIndicatorImageByNo(this.clockImgNo());
        });
        this.digitalClockText = ko.pureComputed(this.computeDigitalClockText);
        this.showTimePassing = ko.observable(false);

        ko.rebind(this);
    }
    
    public computeDigitalClockText = ():string => {
        var minutes: number = 0;
        var seconds: number = 0;
        minutes = Math.floor(this.digitalClockCountdown() / 60.0);
        seconds  = this.digitalClockCountdown() % 60.0;
        var txt:string = utils.formatter.leadingZeros(minutes, 2) + ':' + 
            utils.formatter.leadingZeros(seconds, 2);
        return txt;
    }

    flashTimePassing(secs: number) {
        this.digitalClockCountdown(secs);
        this.showTimePassing(true);
        this.toggleClockSimulation(true);
    }

    hideTimePassing() {
        this.showTimePassing(false);
        this.toggleClockSimulation(false);
        this.digitalClockCountdown(null);
    }
    
    toggleClockSimulation(isEnabled: boolean) {
        clearInterval(this.simulationIntervalId);
        if (isEnabled) {
            this.simulationIntervalId = setInterval(this.nextTimeStep,
                this.simulationInterval);
        }
    }
    
    private nextTimeStep() {
        if (this.digitalClockCountdown() <= 0) {
            this.hideTimePassing();
        }
        if (this.clockImgNo() >= this.lastImgNo) {
            this.clockImgNo(0)
        } else {
            this.clockImgNo(this.clockImgNo() + 1);
        }
        this.digitalClockCountdown(this.digitalClockCountdown() - 1);
    }
}

export = new HUD();
