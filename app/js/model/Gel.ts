import ko = require('knockout');
import _ = require('lodash');

import CompositeContainerModel = require('model/CompositeContainer');
import LaneModel = require('model/Lane');

import ContainerType = require('model/type/Container');

class Gel extends CompositeContainerModel {

    public lanes: KnockoutObservableArray<LaneModel>;
    public isElectrofied: KnockoutObservable<boolean>;

    constructor() {
        super(4, ContainerType.LANE, ContainerType.GEL);

        this.lanes = ko.observableArray(_.range(4).map((i) => new LaneModel()));
        this.isElectrofied = ko.observable(false);

        ko.rebind(this);
    }

    getVacantLane() {
        return _.find(this.lanes(), (lane) => lane.isEmpty());
    }

    getUnstainedLane() {
        return _.find(this.lanes(), (lane) => !lane.isEmpty() && !lane.isStained());
    }
}

export = Gel;
