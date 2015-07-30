import ko = require('knockout');

import LocationType = require('model/type/Location');

import MouseModel = require('model/Mouse');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

class MouseCage {

    public mouse: KnockoutObservable<MouseModel>;
    public hasMouse: KnockoutComputed<boolean>;

    constructor() {
        this.mouse = ko.observable(new MouseModel(MouseType.HEALTHY, MouseBloodType.NORMAL));
        this.hasMouse = ko.pureComputed(() => !!this.mouse(), this);

        ko.rebind(this);
    }

    reset() {
        this.mouse(MouseModel(MouseType.HEALTHY, MouseBloodType.NORMAL));
    }
}

export = MouseCage;
