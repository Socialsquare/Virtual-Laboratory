import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
import LaneModel = require('model/Lane');

class Lane extends SimpleContainerModel {

    public containers: KnockoutObservableArray<LaneModel>;

    constructor() {
        super(ContainerType.LANE, Math.pow(10, 13));

        ko.rebind(this);
    }
}

export = Lane;
