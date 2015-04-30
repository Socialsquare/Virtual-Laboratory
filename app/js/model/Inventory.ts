import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');

import TextHelper = require('utils/TextHelper');
import LocationType = require('model/type/Location');

class Inventory {

    public items: KnockoutObservableArray<Item>;

    constructor() {

        this.items = ko.observableArray([]);
    }

    public add = (item, alternativeLabel = "") => {
        // generate default label
        if (!item.acquired() && item.label) {
            if (alternativeLabel) {
                item.label(alternativeLabel);
            } else {
                item.label(TextHelper.label(item));
            }
        }

        if (!item.acquired()) {
            experimentController.triggerAcquisition(item);
        }

        item.acquired(true);

        if(item.hasOwnProperty('location')) {
            item.location(LocationType.INVENTORY);
        }

        this.items.push(item);
    }

    public hasItem = (item) => {
        return _.contains(this.items(), item);
    }

    public remove = (item) => {
        this.items.remove(item);
    }

    public reset = () => {
        this.items.removeAll();
    }
}

export = Inventory;
