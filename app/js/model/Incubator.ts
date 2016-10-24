import ko = require('knockout');

import experimentController = require('controller/Experiment');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');
import GrowerType = require('model/type/Grower');
import LocationType = require('model/type/Location');
import ActivationType = require('model/type/Activation');

const DEFAULT_TEMP: number = 37.0;
const DEFAULT_TIME: number = 48;
const DEFAULT_HOUR_RESOLUTION: number = 10;

class Incubator {

    public temperature: KnockoutObservable<number>;
    public timer: KnockoutObservable<number>;
    public turnedOn: KnockoutObservable<boolean>;
    public timerID: KnockoutObservable<number>;
    public hourResolution: KnockoutObservable<number>;
    public growerType: KnockoutObservable<GrowerType>;
    public tableSpacePetri: PetriSpaceModel;
    public tableSpaceMicro: MicroSpaceModel;
    public tubeRack: TubeRackModel;

    public temperatureText: KnockoutComputed<string>;
    public timerText: KnockoutComputed<string>;

    constructor() {
        this.temperature = ko.observable(DEFAULT_TEMP);
        this.timer = ko.observable(DEFAULT_TIME); // Time in hours
        this.turnedOn = ko.observable(false);
        this.timerID = ko.observable(null);
        // hourResolution is used in the growth.
        this.hourResolution = ko.observable(DEFAULT_HOUR_RESOLUTION);
        this.growerType = ko.observable(GrowerType.INCUBATOR);

        this.tableSpacePetri = new PetriSpaceModel(2);
        this.tableSpacePetri.location(LocationType.INCUBATOR);
        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.INCUBATOR);
        this.tableSpaceMicro = new MicroSpaceModel(1);
        this.tableSpaceMicro.location(LocationType.INCUBATOR);

        this.temperatureText = ko.pureComputed(() => {
            return '' + this.temperature().toFixed(1) + ' °C';
        });

        this.timerText = ko.pureComputed(() => {
            return '' + Math.round(this.timer()) + ' h';
        });

        ko.rebind(this);
    }

    deactivate() {
        clearTimeout(this.timerID());
        this.turnedOn(false);
        this.timerID(null);

        experimentController.triggerActivation(ActivationType.INCUBATOR, this);
    }

    activate() {
        this.turnedOn.toggle();

        if (this.turnedOn()) {
            var timerID = setInterval(this.growOneHour, 100);
            this.timerID(timerID);
        } else {
            this.deactivate();
        }
    }

    //Grows all containers one hour
    growOneHour() {
        // For-løkke med mindre steps?
        if (this.timer() < 1) {
            this.deactivate();
            this.timer(DEFAULT_TIME);
            return;
        }

        var deltaTime = 1.0 / this.hourResolution();

        for (var i = 0; i < this.hourResolution(); i++) {
            this.tableSpacePetri.growContentsOnce(deltaTime, this.growerType(), 0, this.temperature());
            this.tableSpaceMicro.growContentsOnce(deltaTime, this.growerType(), 0, this.temperature());
            this.tubeRack.growContentsOnce(deltaTime, this.growerType(), 0, this.temperature());
        }

        this.timer(this.timer() - 1);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tableSpaceMicro.removeAll();
        this.tubeRack.removeAll();

        this.temperature(DEFAULT_TEMP);
        this.timer(DEFAULT_TIME);
        this.turnedOn(false);
        clearTimeout(this.timerID());
        this.timerID(null);
        this.hourResolution(DEFAULT_HOUR_RESOLUTION);
        this.growerType(GrowerType.INCUBATOR);
    }
}

export = Incubator;
