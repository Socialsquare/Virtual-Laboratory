import Item = require('model/Item');
import ko = require('knockout');

class ChemicalItem extends Item {

    public itemGetter: () => any;
    public item: KnockoutObservable<Item>;

    constructor(name, itemGetter) {
        super(name);

        this.itemGetter = itemGetter;
        this.item = ko.observable(itemGetter());
    }
}

export = ChemicalItem;
