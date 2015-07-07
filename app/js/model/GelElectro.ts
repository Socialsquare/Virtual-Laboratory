import ko = require('knockout');
import GelModel = require('model/Gel');

class GelElectro {

    public status: KnockoutObservable<boolean>;
    public gelSlot: KnockoutObservable<GelModel>;
    public hasGel: KnockoutComputed<boolean>;

    constructor() {
        this.status = ko.observable(false);
        this.gelSlot = ko.observable(null);

        this.hasGel = ko.pureComputed(() => !!this.gelSlot(), this);

        ko.rebind(this);
    }
}

export = GelElectro;
