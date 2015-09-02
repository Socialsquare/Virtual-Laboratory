import ko = require('knockout');
import _ = require('lodash');

import DataHelper = require('utils/DataHelper');
import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');
import GlucoseBagController = require('controller/GlucoseBag');

import BottleModel = require('model/Bottle');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import heartRateJsonData = require('json!datadir/heartRate.json');

import ContainerFactory = require( 'factory/Container');
import LiquidFactory = require('factory/Liquid');

type DataPoint = [number, number];

type PlotData = {
    bloodData: DataPoint[];
    heartRateData: DataPoint[];
}

class MouseController extends BaseViewController {

    public videoController: VideoController;

    public mousecage: KnockoutObservable<MouseCageModel>;
    public mouseDrinking: KnockoutObservable<boolean>;

    public lowBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public highBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public diabetesDevelopedToggle: KnockoutObservable<boolean>;

    public plotData: KnockoutObservable<PlotData>;
    public isHrGraphEnabled: KnockoutObservable<boolean>;

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;

    public graphTimer: KnockoutObservable<number>;

    public simulationInterval: number = 100;  // millisecond
    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[] = [];
    public graphHrRange: KnockoutObservableArray<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;

    public bottle: BottleModel;

    constructor() {

        super('mouse');

        this.videoController = new VideoController(true);

        this.mousecage = this.gameState.mousecage;
        this.mouseDrinking = ko.observable(false);

        this.lowBloodSugarWarningToggle = ko.observable(false);
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);

        this.isHrGraphEnabled = ko.observable(false);
        this.isBloodSugarGraphEnabled = ko.observable(true);

        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);

        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.graphHrRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));

        if (this.mousecage.hasMouse()) {
            this.mousecage.mouse().bloodSugar.subscribe((bloodSugar) => {
                if (bloodSugar < 1.5 && !this.lowBloodSugarWarningToggle()) {
                    this.lowBloodSugarWarningToggle(true);
                    this.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
                }
                else if (bloodSugar > this.mousecage.mouse().maxBloodSugar() * 0.8
                         && !this.highBloodSugarWarningToggle()
                         && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    this.highBloodSugarWarningToggle(true);
                    this.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');
                }
                else if (bloodSugar >= this.mousecage.mouse().maxBloodSugar()
                         && !this.diabetesDevelopedToggle()
                         && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    this.diabetesDevelopedToggle(true);
                    this.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');
                    this.mousecage.mouse().mouseBloodType(MouseBloodType.DIABETIC);
                }
            });
        }

        this.plotData = ko.observable(<PlotData>{
            bloodData: [[]],
            heartRateData: [[]]
        });

        this.graphTimer = ko.observable(null);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

        this.glucoseBagController = new GlucoseBagController(this.mousecage.glucoseBag);

        this.updatePlotData();

        ko.rebind(this);
    }

    exportData() {
        // FIXME: I think this should export more than what's currently
        // FIXME: on the display graph but with a sane limit...
        // FIXME: perhaps we can adjust size of it based on
        // FIXME: time/clock/watch of an experiment...
        var raw = this.plotData();
        var headers = ['time', 'bloodsugar', 'heart'];
        var parsed = _(raw.bloodData)
            .zip(raw.heartRateData)
            .map((row) => {
                var bloodsugar = row[0][1];
                var hr;
                if (row[1][1]) {
                    hr = _.sample(heartRateJsonData.pulse);
                } else {
                    hr = row[1][1]; // either null or 0
                }
                var line = [row[0][0], bloodsugar, hr];
                return line;
            })
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }

    toggleHartRate(): void {
        this.isHrGraphEnabled(!this.isHrGraphEnabled());
    }

    toggleBloodSugar(): void {
        this.isBloodSugarGraphEnabled(!this.isBloodSugarGraphEnabled());
    }

    updateGraphRanges() {
        this.graphHrRange.shift();
        if (this.isHrGraphEnabled()) {
            this.graphHrRange.push(true);
        } else {
            this.graphHrRange.push(false);
        }

        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }
    }

    /**
     * Generates blood sugar leveldata for plot graph.
     * If mouse is dead sugar level is 0.
     * if blood sugar level graph is disabled sugar level is null.
     * @return {Array}
     */
    getBloodDataForPlot() {
        var bloodData = _.map(this.graphRange, (i): [number, number] => {
            var sugar = null;
            if (!this.mousecage.mouse().alive()) {
                sugar = 0;
            } else if (this.graphBloodRange()[i]) {
                sugar = this.mousecage.mouse().bloodData()[i];
            }
            return [i, sugar];
        });
        return bloodData;
    }

    /**
     * Generates pulse data for plot graph.
     * If mouse is dead it's HR is 0.
     * if HR graph is disabled HR is null.
     * @return {Array}
     */
    getHrDataForPlot() {
        var hrData = [];
        hrData = _.map(this.graphRange, (i): [number, number] => {
            var hr = null;

            var dataIndex = this.mousecage.mouse().heartRateIndex + i;
            dataIndex = dataIndex % this.mousecage.mouse().heartRateData.length;
            if (!this.mousecage.mouse().alive()) {
                hr = 0;
            } else if (this.graphHrRange()[i]) {
                hr = this.mousecage.mouse().heartRateData[dataIndex];
            }
            return [i, hr];
        });
        return hrData;
    }

    updatePlotData() {

        if (!this.mousecage.hasMouse()) return;

        this.updateGraphRanges();
        var bloodData = this.getBloodDataForPlot();
        var heartRateData = this.getHrDataForPlot();

        this.plotData({
            bloodData: bloodData,
            heartRateData: heartRateData
        });
    }

    nextTimeStep() {
        if (!this.mousecage.hasMouse()) return;

        this.mousecage.mouse().nextBloodStep();
        this.mousecage.mouse().nextHeartStep();
        
        // push value to plot and add it to export collection
        // this.mousecage.mouse().nextGlucoseInfusionRateStep();

        if (this.mousecage.mouse().hasLethalBloodSugar()) {
            this.toggleSimulation(false);

            this.videoController.play('fast-die-insulin', false).then(() => {
                this.mousecage.mouse().alive(false);
                this.mouseDrinking(false);
                this.popupController.message('mouse.died_glucose.header', 'mouse.died_glucose.body');
            });
        }

        this.updatePlotData();
    }

    injectionFromState() {
        if (!this.mousecage.hasMouse()) return;

        if (this.mousecage.mouse().alive()) {
            switch (this.mousecage.mouse().mouseType()) {
            case MouseType.HEALTHY:
                return this.videoController.play('fast-injection', false);

            case MouseType.SMALLPOX:
                return this.videoController.play('smallpox-injection', false);

            case MouseType.GOUT:
                return this.videoController.play('slow-injection-body-gout', false);
            }
        }
    }

    runFromState() {
        if (!this.mousecage.hasMouse()) return;

        if (this.mousecage.mouse().alive()) {
            switch (this.mousecage.mouse().mouseType()) {
            case MouseType.HEALTHY:
                this.videoController.play('fast-loop', true);
                break;

            case MouseType.SMALLPOX:
                this.videoController.play('smallpox-loop', true);
                break;

            case MouseType.GOUT:
                this.videoController.play('slow-loop-gout', true);
                break;

            case MouseType.INSOMNIA:
                this.videoController.play('slow-loop', true);
                break;

            case MouseType.PSORIASIS:
                this.videoController.play('psoriasis-loop', true);
                break;
            default:
                console.log('Mouse video error');
                break;
            }
        }
    }

    enter() {
        super.enter();

        this.runFromState();
        this.toggleSimulation(!!this.mousecage.hasMouse());
    }

    exit() {
        this.videoController.stop();
        this.toggleSimulation(false);
    }

    toggleSimulation(enabled) {
        if (enabled) {
            this.graphTimer(setInterval(this.nextTimeStep, this.simulationInterval));
        } else {
            clearTimeout(this.graphTimer());
        }
    }

    handleDropOnMouse(item) {
        return DropOnMouseHelper.handleDrop(this, item);
    }

    removeMouse() {
        this.videoController.stop();
        this.toggleSimulation(false);
        this.mousecage.mouse(null);
    }
}

export = MouseController;
