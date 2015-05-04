import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');

import SimpleContainerModel = require('model/SimpleContainer');
import SyringeModel = require('model/Syringe');
import gameState = require('model/GameState');

import ContainerType = require('model/type/Container');

import ImageHelper = require('utils/ImageHelper');
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
