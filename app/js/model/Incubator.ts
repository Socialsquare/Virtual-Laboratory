import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');
import ContainerType = require('model/type/Container');
import GrowerType = require('model/type/Grower');
import LocationType = require('model/type/Location');
import ActivationType = require('model/type/Activation');

class Incubator {

    public temperature: KnockoutObservable<number>;
    public timer: KnockoutObservable<number>;
    public turnedOn: KnockoutObservable<boolean>;
    public timerID: KnockoutObservable<number>;
    public hourResolution: KnockoutObservable<number>;
    public growerType: KnockoutObservable<GrowerType>;
    public tableSpacePetri: PetriSpaceModel;
    public tubeRack: TubeRackModel;

    public temperatureText: KnockoutComputed<string>;
    public timerText: KnockoutComputed<string>;

    constructor() {
        this.temperature = ko.observable(35.0);
        this.timer = ko.observable(48); // Time in hours
        this.turnedOn = ko.observable(false);
        this.timerID = ko.observable(null);
        this.hourResolution = ko.observable(10); // This is used in the growth.
        this.growerType = ko.observable(GrowerType.INCUBATOR);

        this.tableSpacePetri = new PetriSpaceModel(6);
        this.tableSpacePetri.location(LocationType.INCUBATOR);
        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.INCUBATOR);

        this.temperatureText = ko.computed(() => {
            return '' + this.temperature().toFixed(1) + ' °C';
        });

        this.timerText = ko.computed(() => {
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
            this.timer(48);
            return;
        }

        var deltaTime = 1.0 / this.hourResolution();

        for (var i = 0; i < this.hourResolution(); i++) {
            this.tableSpacePetri.growContentsOnce(deltaTime, this.growerType(), 0, this.temperature());
            this.tubeRack.growContentsOnce(deltaTime, this.growerType(), 0, this.temperature());
        }

        this.timer(this.timer() - 1);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tubeRack.removeAll();

        this.temperature(35.0);
        this.timer(48);
        this.turnedOn(false);
        clearTimeout(this.timerID());
        this.timerID(null);
        this.hourResolution(10);
        this.growerType(GrowerType.INCUBATOR);
    }
}

export = Incubator;
