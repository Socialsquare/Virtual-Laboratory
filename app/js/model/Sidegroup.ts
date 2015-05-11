import ko = require('knockout');
import SpecialItemType = require('model/type/SpecialItem');

// Helper type
type SidegroupInfo = {
    pKa: number,
    weight: string,
    bindingLength: number,
    bindingTypes: string[]
}

class Sidegroup {

    public type: KnockoutObservable<SpecialItemType>;
    public id: number;
    public info: SidegroupInfo;
    public file: KnockoutComputed<string>;

    //TODO! all below are unused?
    public index: any;
    public origin: KnockoutObservable<any>;
    public molarWeight: any;

    constructor(values) {
        this.type = ko.observable(SpecialItemType.SIDEGROUP);

        this.id = values.id;
        this.info = values.info;
        this.index = ko.observable(values.index);
        this.origin = ko.observable(values.origin);
        this.molarWeight = ko.observable(values.molarWeight);

        this.file = ko.computed(() => {
            return 'assets/svgs/sidegroup_' + this.id + '.svg';
        });
        // TODO: other field
    }
}

export = Sidegroup;
