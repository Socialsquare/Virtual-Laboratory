import ko = require('knockout');
import SpecialItemType = require('model/type/SpecialItem');


class Sidegroup {

    public type: KnockoutObservable<SpecialItemType.SIDEGROUP>;
    public id: number;
    public info: {};
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

        this.file = ko.computed(function () {
            return 'assets/svgs/sidegroup_' + self.id + '.svg';
        });
        // TODO: other field
    }
}

export = Sidegroup;
