import ko = require('knockout');

class GlucoseBag {

    public status: KnockoutObservable<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;

    constructor() {
        this.status = ko.observable(false);
        this.glucoseInfusionRate = ko.observable(0);

        ko.rebind(this);
    }

    public activate() {
        this.status(!this.status());
        if (!this.status()) {
            this.glucoseInfusionRate(0);
        }
    }
    
}

export = GlucoseBag;
