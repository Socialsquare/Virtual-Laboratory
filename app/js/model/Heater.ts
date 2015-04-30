import ko = require('knockout');
import CompositeContainerModel = require('model/CompositeContainer');
import ContainerType = require('model/type/Container');


class HeaterModel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(3, ContainerType.TUBE, ContainerType.HEATER);

        this.status = ko.observable(false);
    }

    // TODO: implement
    public activate = () => {
        throw 'JegErHerIkke, Derfor: Undtagelsestilstand';
    }
}

export = HeaterModel;
