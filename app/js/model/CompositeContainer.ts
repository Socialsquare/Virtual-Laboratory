import ko = require('knockout');
import _ = require('lodash');

import SimpleContainerModel = require('model/SimpleContainer');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

class CompositeContainer {

    public type: KnockoutObservable<ContainerType>;
    public capacity: number;
    public containers: KnockoutObservableArray<SimpleContainerModel>;

    public acceptedType: KnockoutObservable<ContainerType>; //TODO! type?
    public location: KnockoutObservable<LocationType>;

    constructor(capacity: number, acceptedType: ContainerType, type: ContainerType) {

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

    addAt(position, container) {
        this._addAt(position, container);
        return this;
    }

    anyContainsAll(liquidTypes) {
        // TODO: for each container
        throw 'NotYetImplementedException';
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

    removeAll() {
        this.containers(new Array(this.capacity));
    }

    growContentsOnce(deltaTime, growerType, ph, temperature) {
        // deltaTime is in "hours"
        _.forEach(this.containers(), (container) => {
            if(!container)
                return;

            container.growContentsOnce(deltaTime, growerType, ph, temperature);
        });
    }
}

export = CompositeContainer;
