import ko = require('knockout');

class InventoryItem {

    public name: KnockoutObservable<string>;
    public acquired: KnockoutObservable<boolean>;
    public extraInfo: KnockoutObservable<string>;

    constructor(name) {
        this.name = ko.observable(name);
        this.acquired = ko.observable(false);
        this.extraInfo = ko.observable('');
    }
}

export = InventoryItem;
