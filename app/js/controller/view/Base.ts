/* tslint:disable:no-empty */

import ko = require('knockout');

import gameState = require('model/GameState');

import router = require('controller/Router');
import popupController = require('controller/Popup');
import quizController = require('controller/Quiz');
import experimentController = require('controller/Experiment');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');
import SpecialItemFactory = require('factory/SpecialItem');

import ImageHelper = require('utils/ImageHelper');
import DragHelper = require('utils/DragHelper');

import LiquidType = require('model/type/Liquid');

class Base {

    public gameState = gameState;
    public router = router;
    public ImageHelper = ImageHelper;
    public DragHelper = DragHelper;
    public popupController = popupController;
    public quizController = quizController;
    public experimentController = experimentController;
    public liquidFactory = LiquidFactory;
    public containerFactory = ContainerFactory;
    public specialItemFactory = SpecialItemFactory;

    public templateName: string;
    public hasMenu: KnockoutObservable<boolean>;
    public shouldHidePipette: KnockoutObservable<boolean>;

    constructor(templateName: string) {
        this.templateName = templateName;

        this.hasMenu = ko.observable(true);
        // false = CAN show pipette.
        this.shouldHidePipette = ko.observable(false);

        ko.rebind(this);
    }

    maybeHidePippete() {
        if (this.gameState.pipette.active()
            && this.shouldHidePipette()) {
            this.gameState.pipette.active.toggle();
        }
    }

    enter() {
        this.maybeHidePippete();
    }

    exit() {}

    // TODO: move to utility class?
    smallPoxGuard(position, container) {
        if (container.contains(LiquidType.ANTIGEN_SMALLPOX)) {
            this.popupController.message('fumehood.smallpox.header', 'fumehood.smallpox.body');
            return false;
        }
        return true;
    }
}

export = Base
