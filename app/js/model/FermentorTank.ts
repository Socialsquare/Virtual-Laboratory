import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class FermentorTank extends SimpleContainerModel {

    // TODO only organisms with a "has been in high concentration"-flag. This imitates IRL...
    public hasRun: KnockoutObservable<boolean>;

    constructor() {
        super(ContainerType.FERMENTOR_TANK, Math.pow(10, 13));

        //This is used when restarting the fermentor.
        this.hasRun = ko.observable(false);

        ko.rebind(this);
    }
}

export = FermentorTank;
