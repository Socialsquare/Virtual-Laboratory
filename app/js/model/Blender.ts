import ko = require('knockout');

class Blender {

    public status: KnockoutObservable<boolean>;

    constructor() {
        this.status = ko.observable(false);

        ko.rebind(this);
    }
}

export = Blender;
