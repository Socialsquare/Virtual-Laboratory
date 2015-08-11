import ko = require('knockout');
import _ = require('lodash');

import SpecialItemModel = require('model/SpecialItem');
import LaneModel = require('model/Lane');

import SpecialItemType = require('model/type/SpecialItem');

class Gel extends SpecialItemModel {

    public lanes: KnockoutObservableArray<LaneModel>;
    public isElectrofied: KnockoutObservable<boolean>;
    public isStained: KnockoutObservable<boolean>;

    constructor() {
        super(SpecialItemType.GEL);

        this.lanes = ko.observableArray(_.range(4).map((i) => new LaneModel()));
        this.isElectrofied = ko.observable(false);
        this.isStained = ko.observable(false);

        ko.rebind(this);
    }

    getVacantLane() {
        return _.find(this.lanes(), (lane) => lane.isEmpty());
    }
}

export = Gel;
