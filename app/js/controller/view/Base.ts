import ko = require('knockout');
import Base = require('base');

import gameState = require('model/GameState');
import ActivationType = require('model/type/Activation');

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
    public ActivationType = ActivationType;

    constructor(templateName) {

        this.templateName = templateName;
        this.hasMenu = ko.observable(true);
        // false = CAN show pipette.
        this.shouldHidePipette = ko.observable(false);
    }

    public maybeHidePippete = () => {
        if (this.gameState.pipette.active()
            && this.shouldHidePipette()) {
            this.gameState.pipette.active.toggle();
        }
    }

    public enter = () => {
        this.maybeHidePippete();
    }

    public exit = () => {}

    // TODO: move to utility class?
    public smallPoxGuard = (position, container) => {
        if (container.contains(LiquidType.ANTIGEN_SMALLPOX)) {
            this.popupController.message('fumehood.smallpox.header', 'fumehood.smallpox.body');
            return false;
        }
        return true;
    }
}

export = Base
