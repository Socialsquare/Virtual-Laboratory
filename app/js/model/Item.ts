import ko = require('knockout');

class Item {

    public name: KnockoutObservable<string>;

    constructor(name) {
        this.name = ko.observable(name);
    }
}

export = Item;
