import ko = require('knockout');
import _ = require('lodash');

import CompositeContainerModel = require('model/CompositeContainer');
import LaneModel = require('model/Lane');

import ContainerType = require('model/type/Container');

class Gel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;
    public lanes: KnockoutObservableArray<LaneModel>;
    public isElectrofied: KnockoutObservable<boolean>;

    constructor() {
        super(4, ContainerType.LANE, ContainerType.GEL);

        this.status = ko.observable(false);
        this.lanes = ko.observableArray(_.range(4).map((i) => new LaneModel(i+1)));
        this.isElectrofied = ko.observable(false);

        ko.rebind(this);
    }

    getVacantLane() {
        return _.find(this.lanes(), (lane) => !lane.hasFFD());
    }

    getUnstainedLane() {
        return _.find(this.lanes(), (lane) => !lane.isStained());
    }
}

export = Gel;
