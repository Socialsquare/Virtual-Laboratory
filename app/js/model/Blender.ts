import ko = require('knockout');

import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Blender {

    public status: KnockoutObservable<boolean>;

    constructor() {
        this.status = ko.observable(false);
    }
}

export = Blender;
