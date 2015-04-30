import ko = require('knockout');

import ConsequenceType = require('model/type/Consequence');

class Consequence {

    public type: KnockoutObservable<ConsequenceType>;

    constructor(type) {
        this.type = ko.observable(type);
    }
}

export = Consequence;
