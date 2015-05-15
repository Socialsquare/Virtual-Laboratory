import ko = require('knockout');

class InventoryItem {

    public name: KnockoutObservable<string>;
    public acquired: KnockoutObservable<boolean>;

    constructor(name) {
        this.name = ko.observable(name);
        this.acquired = ko.observable(false);
    }
}

export = InventoryItem;
