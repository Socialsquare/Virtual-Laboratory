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
import ApparatusType = require('model/type/Apparatus');
import ApparatusLocationType = require('model/type/ApparatusLocation');
import PipetteModel = require('model/Pipette');
import SimpleContainerModel = require('model/SimpleContainer');

class Base {

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
    public gameStatePipette: PipetteModel;

    constructor(templateName: string) {
        this.templateName = templateName;

        this.hasMenu = ko.observable(true);
        // false = CAN show pipette.
        this.shouldHidePipette = ko.observable(false);
        
        this.gameStatePipette = gameState.pipette;

        ko.rebind(this);
    }

    // Relayed for use in templates (could also be implemented as a custom binding)
    apparatusEnabled(location: string, aType: string) {
        return experimentController.apparatusEnabled(location, aType);
    }

    maybeHidePippete() {
        if (gameState.pipette.active() &&
                this.shouldHidePipette()) {
            gameState.pipette.active(!gameState.pipette.active());
        }
    }

    enter() {
        this.maybeHidePippete();
    }

    exit() {}

    // TODO: move to utility class?
    smallPoxGuard(position: number, container: SimpleContainerModel) {
        if (container.contains(LiquidType.ANTIGEN_SMALLPOX)) {
            this.popupController.message('fumehood.smallpox.header', 'fumehood.smallpox.body');
            return false;
        }
        return true;
    }
}

export = Base
