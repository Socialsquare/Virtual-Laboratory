import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

import utils = require('utils/utils');
import DataHelper = require('utils/DataHelper');
import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');

import MouseModel = require('model/Mouse');
import SpleenModel = require('model/Spleen');
import BottleModel = require('model/Bottle');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import SpecialItemType = require('model/type/SpecialItem');

import ContainerFactory = require( 'factory/Container');
import LiquidFactory = require('factory/Liquid');

type PlotData = {
    bloodData: number[][],
    heartRateData: number[][]
}

class MouseController extends BaseViewController {

    public videoController: VideoController;

    public mouse: KnockoutObservable<MouseModel>;
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

        this.mouse = this.gameState.mouse;
        this.mouseDrinking = ko.observable(false);

        // Begin: Notifications

        this.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);
        this.mouse().blodSukker.subscribe((blodSukker) => {
            if (blodSukker < 1.5 && !this.lowBloodSugarWarningToggle()) {
                this.lowBloodSugarWarningToggle(true);
                this.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
            } else if (blodSukker > this.mouse().maxBlodSukker() * 0.8
                       && !this.highBloodSugarWarningToggle() && this.mouse().mouseBloodType() === MouseBloodType.NORMAL) {

                this.highBloodSugarWarningToggle(true);
                this.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');

            } else if (blodSukker >= this.mouse().maxBlodSukker()
                       && !this.diabetesDevelopedToggle() && this.mouse().mouseBloodType() === MouseBloodType.NORMAL) {

                this.diabetesDevelopedToggle(true);
                this.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');

                this.mouse().mouseBloodType(MouseBloodType.DIABETIC);
            }
        });

        // End: Notifications

        this.plotData = ko.observable(<PlotData>{
            bloodData: [[]],
            heartRateData: [[]]
        });

        this.graphTimer = ko.observable(null);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

        //TODO: modify to object /w two fields
        /*            this.plotData(_.map(_.range(0, 250), (i) => {
                      return [i, this.mouse().bloodData()[i]];
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
        var bloodData = _.map(_.range(0, 250), (i) => {
            return [i, this.mouse().bloodData()[i]];
        });

        var heartRateData = _.map(_.range(0,250), (i) => {

            if (!this.mouse().alive())
                return [i, 0];

            var dataIndex = this.mouse().heartRateIndex + i;
            dataIndex = dataIndex % this.mouse().heartRateData.length;

            return [i, this.mouse().heartRateData[dataIndex]];
        });

        this.plotData({
            bloodData: bloodData,
            heartRateData: heartRateData
        });
    }

    nextTimeStep() {
        this.mouse().nextBloodStep();
        this.mouse().nextHeartStep();

        if (this.mouse().hasLethalBloodSugar()) {
            this.toggleSimulation(false);

            this.videoController.play('fast-die-insulin', false).then(() => {
                this.mouse().alive(false);
                this.popupController.message('mouse.died_insulin.header', 'mouse.died_insulin.body');
            });
        }

        this.updatePlotData();
    }

    injectionFromState() {
        if (this.mouse().alive()) {
            switch (this.mouse().mouseType()) {
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
        if (this.mouse().alive()) {
            switch (this.mouse().mouseType()) {
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

        this.toggleSimulation(true);
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
}

export = MouseController;
