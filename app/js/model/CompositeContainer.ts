import ko = require('knockout');
import _ = require('lodash');

import SimpleContainerModel = require('model/SimpleContainer');
import SpecialItemModel = require('model/SpecialItem');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');
import LiquidType = require('model/type/Liquid');

class CompositeContainer extends SpecialItemModel {

    public type: KnockoutObservable<ContainerType>;
    public capacity: number;
    public containers: KnockoutObservableArray<SimpleContainerModel>;

    public acceptedType: KnockoutObservable<ContainerType>;
    public location: KnockoutObservable<LocationType>;

    constructor(capacity: number, acceptedType: ContainerType, type: ContainerType) {
        super('compositecontainer');

        this.type = ko.observable(type);
        this.capacity = capacity;
        this.containers = ko.observableArray(new Array(capacity));
        this.acceptedType = ko.observable(acceptedType);
        this.location = ko.observable(null);

        ko.rebind(this);
    }

    _addAt(position: number, container: SimpleContainerModel) {
        if (container.type() !== this.acceptedType()) {
            // TODO: notify error
            return false;
        }

        if (!!this.get(position)) {
            return false;
        }

        container.location(this.location());
        this.containers.setAt(position, container);

        return true;
    }

    addAt(position: number, container: SimpleContainerModel) {
        this._addAt(position, container);
        return this;
    }

    anyContainsAll(liquidTypes: LiquidType[]) {
        _.some(this.containers(), (container) => {
            return container.containsAll(liquidTypes);
        });
    }

    get(position: number) {
        return this.containers()[position];
    }

    hasContainerAt(position: number) {
        return !!this.get(position);
    }

    remove(position: number) {
        var container = this.get(position);
        if (!container)
            return;

        this.containers.setAt(position, null);
    }

    removeContainer(container: SimpleContainerModel) {
        var idx = _.findIndex(this.containers(), c => c === container);
        this.remove(idx);
    }

    removeAll() {
        this.containers(new Array(this.capacity));
    }

    growContentsOnce(deltaTime: number, growerType: number, ph: number, temperature: number) {
        // deltaTime is in "hours"
        _.forEach(this.containers(), (container) => {
            if (!container)
                return;

            container.growContentsOnce(deltaTime, growerType, ph, temperature);
        });
    }
}

export = CompositeContainer;
