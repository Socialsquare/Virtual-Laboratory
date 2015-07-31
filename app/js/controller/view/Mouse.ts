import ko = require('knockout');
import _ = require('lodash');

import DataHelper = require('utils/DataHelper');
import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');

import MouseModel = require('model/Mouse');
import BottleModel = require('model/Bottle');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

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
    public graphTimer: KnockoutObservable<number>;

    public bottle: BottleModel;

    constructor() {

        super('mouse');

        this.videoController = new VideoController(true);

        this.mousecage = this.gameState.mousecage;
        this.mouseDrinking = ko.observable(false);

        // Begin: Notifications

        this.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);

        if (this.mousecage.hasMouse()) {
            this.mousecage.mouse().blodSukker.subscribe((blodSukker) => {
                if (blodSukker < 1.5 && !this.lowBloodSugarWarningToggle()) {
                    this.lowBloodSugarWarningToggle(true);
                    this.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
                }
                else if (blodSukker > this.mousecage.mouse().maxBlodSukker() * 0.8
                         && !this.highBloodSugarWarningToggle()
                         && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    this.highBloodSugarWarningToggle(true);
                    this.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');
                }
                else if (blodSukker >= this.mousecage.mouse().maxBlodSukker()
                         && !this.diabetesDevelopedToggle()
                         && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    this.diabetesDevelopedToggle(true);
                    this.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');
                    this.mousecage.mouse().mouseBloodType(MouseBloodType.DIABETIC);
                }
            });
        }

        // End: Notifications

        this.plotData = ko.observable(<PlotData>{
            bloodData: [[]],
            heartRateData: [[]]
        });

        this.graphTimer = ko.observable(null);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

        //TODO: modify to object /w two fields
        /*            this.plotData(_.map(_.range(0, 250), (i) => {
                      return [i, this.mousecage.mouse().bloodData()[i]];
                      }));*/


        this.updatePlotData();

        ko.rebind(this);
    }

    exportData() {
        var raw = this.plotData();
        var headers = ['time', 'bloodsugar', 'heart'];
        var parsed = _(raw.bloodData)
            .zip(raw.heartRateData)
            .map((row) => {
                return [row[0][0], row[0][1], row[1][1]];
            })
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }

    updatePlotData() {
        if(!this.mousecage.hasMouse())
            return;

        var bloodData = _.map(_.range(0, 250), (i): [number, number] => {
            return [i, this.mousecage.mouse().bloodData()[i]];
        });

        var heartRateData = _.map(_.range(0, 250), (i): [number, number] => {

            if (!this.mousecage.mouse().alive())
                return [i, 0];

            var dataIndex = this.mousecage.mouse().heartRateIndex + i;
            dataIndex = dataIndex % this.mousecage.mouse().heartRateData.length;

            return [i, this.mousecage.mouse().heartRateData[dataIndex]];
        });

        this.plotData({
            bloodData: bloodData,
            heartRateData: heartRateData
        });
    }

    nextTimeStep() {
        if(!this.mousecage.hasMouse())
            return;

        this.mousecage.mouse().nextBloodStep();
        this.mousecage.mouse().nextHeartStep();

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
        if(!this.mousecage.hasMouse())
            return;

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
        if(!this.mousecage.hasMouse())
            return;

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
            this.graphTimer(setInterval(this.nextTimeStep, 100));
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
