import ko = require('knockout');

class Well {

    public hasAntibody: KnockoutObservable<boolean>;
    public hasFluorescentSecondaryAntibody: KnockoutObservable<boolean>;

    constructor() {
        this.hasAntibody = ko.observable(false);
        this.hasFluorescentSecondaryAntibody = ko.observable(false);

        ko.rebind(this);
    }

    reset() {
        this.hasAntibody(false);
        this.hasFluorescentSecondaryAntibody(false);
    }

    clone() {
        var clone = new Well();
        clone.hasAntibody(this.hasAntibody());
        clone.hasFluorescentSecondaryAntibody(this.hasFluorescentSecondaryAntibody());

        return clone;
    }
}

export = Well;
