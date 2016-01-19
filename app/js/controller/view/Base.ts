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
    public isPipetteVisible: KnockoutObservable<boolean>;
    private _isPipetteVisibleSubscription = null;
    public pipette: PipetteModel;

    constructor(templateName: string) {
        this.templateName = templateName;

        this.hasMenu = ko.observable(true);
        
        this.isPipetteVisible = ko.observable(false);
        this.pipette = gameState.pipette;
        this._isPipetteVisibleSubscription = gameState.pipette.active.subscribe(
                (newVal: boolean)=>{
            this.isPipetteVisible(newVal);
        });
        // FIXME: I have no idea where to call _isPipetteVisibleSubscription.dispose()
        // FIXME: I don't call this in exit() because I don't create it in enter()
        // FIXME: and I don't create it in enter() because pipette is in gameState
        // FIXME: which means its "active" value can change before a user enters a view controller
        // FIXME: so every view controller instance has subscription to pipette :-)
        //this._isPipetteVisibleSubscription.dispose();

        ko.rebind(this);
    }

    // Relayed for use in templates (could also be implemented as a custom binding)
    apparatusEnabled(location: string, aType: string) {
        return experimentController.apparatusEnabled(location, aType);
    }

    enter() {
    }

    exit() {
    }

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
