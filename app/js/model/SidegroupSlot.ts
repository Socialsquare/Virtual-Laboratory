import ko = require('knockout');

import SpecialItemType = require('model/type/SpecialItem');
import SidegroupModel = require('model/Sidegroup');


class SidegroupSlot {

    public type: KnockoutObservable<SpecialItemType>;
    public position: number;
    public index: number;
    public sidegroup: KnockoutObservable<SidegroupModel>;
    public optimalLength: number;
    public bindingType: string;
    public hasSidegroup: KnockoutComputed<boolean>;

    constructor(values) {
        this.type = ko.observable(SpecialItemType.SIDEGROUP_SLOT);
        this.position = values.position;
        this.index = values.index;
        this.sidegroup = ko.observable(null);
        this.optimalLength = values.optimalLength;
        this.bindingType = values.bindingType;

        this.hasSidegroup = ko.computed(() => {
            return !!this.sidegroup();
        });
    }
}

export = SidegroupSlot;
