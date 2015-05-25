import ko = require('knockout');

import SimpleContainerModel = require('model/SimpleContainer');

import DragHelper = require('utils/DragHelper');

class SimpleContainerController<T extends SimpleContainerModel> {

    public DragHelper: DragHelper;
    public simpleContainer: T;

    // Whether a placeholder should be shown in the view
    public showPlaceholder: KnockoutObservable<boolean>;

    constructor(simpleContainer: T) {
        this.DragHelper = DragHelper;
        this.simpleContainer = simpleContainer;

        this.showPlaceholder = ko.observable(false);
    }

    public handleContainerDrop = (item) => {
        throw 'Needs implementation';
    }
}

export = SimpleContainerController;
