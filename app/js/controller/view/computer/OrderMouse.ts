import ko = require('knockout');

import BaseComputer = require('controller/view/computer/Base');
import experimentController = require('controller/Experiment');

import gameState = require('model/GameState');
import MouseModel = require('model/Mouse');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import ComputerScreenType = require('model/type/ComputerScreen');
import ActivationType = require('model/type/Activation');

import utils = require('utils/utils');

class OrderMouse extends BaseComputer {

    public availableMice: KnockoutObservableArray<MouseModel>;
    public selectedIndex: KnockoutObservable<number>;
    public selectedMouse: KnockoutComputed<MouseModel>;

    constructor() {
        super('computer-order-mouse', 'computer.screen.mouse');

        this.availableMice = ko.observableArray([
            new MouseModel(MouseType.HEALTHY, MouseBloodType.DIABETIC),
            new MouseModel(MouseType.HEALTHY, MouseBloodType.NORMAL),
            /*new MouseModel(MouseType.GOUT,     MouseBloodType.NORMAL),*/
            new MouseModel(MouseType.SMALLPOX, MouseBloodType.NORMAL),
            /*new MouseModel(MouseType.INSOMNIA, MouseBloodType.NORMAL),*/
            new MouseModel(MouseType.PSORIASIS, MouseBloodType.NORMAL)
        ]);

        this.selectedIndex = ko.observable(0);
        this.selectedMouse = ko.computed(() => {
            return this.availableMice()[this.selectedIndex()];
        });
    }

    public orderMouse = () => {
        this.popupController
            .confirm('computer.screen.mouse_confirm.header', 'computer.screen.mouse_confirm.body')
            .then(() => {
                var mouse = this.selectedMouse();
                this.gameState.mouse(mouse.clone());
                //TODO: not enough with setting mouse on gameState it seems?

                this.changeScreen(this.Screens.MENU);

                experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_MOUSE, mouse);
            });
    }
}

export = OrderMouse;
