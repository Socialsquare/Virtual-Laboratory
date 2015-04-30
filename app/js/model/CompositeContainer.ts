import ko = require('knockout');
import _ = require('lodash');

import SimpleContainerModel = require('model/SimpleContainer');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');


class CompositeContainer {

    public type: KnockoutObservable<ContainerType>;
    public capacity: number;
    public containers: KnockoutObservableArray<SimpleContainerModel>;

    public acceptedType: KnockoutObservable<any>; //TODO! type?
    public location: KnockoutObservable<LocationType>;

    constructor(capacity, acceptedType, type) {

        this.type = ko.observable(type);
        this.capacity = capacity;
        this.containers = ko.observableArray(new Array(capacity));
        this.acceptedType = ko.observable(acceptedType);
        this.location = ko.observable(null);
    }

    public _addAt = (position, container) => {
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

    public addAt = (position, container) => {
        this._addAt(position, container);
        return this;
    }

    public anyContainsAll = (liquidTypes) => {
        // TODO: for each container
        throw 'NotYetImplementedException';
    }

    public get = (position) => {
        return this.containers()[position];
    }

    public hasContainerAt = (position) => {
        return !!this.get(position);
    }

    public remove = (position) => {
        var container = this.get(position);
        if (!container)
            return;

        this.containers.setAt(position, null);
    }

    public removeAll = () => {
        this.containers(new Array(this.capacity));
    }

    public growContentsOnce = (deltaTime, growerType, ph, temperature) => {
        // deltaTime is in "hours"
        _.forEach(this.containers(), (container) => {
            if(!container)
                return;

            container.growContentsOnce(deltaTime, growerType, ph, temperature);
        });
    }
}

export = CompositeContainer;
