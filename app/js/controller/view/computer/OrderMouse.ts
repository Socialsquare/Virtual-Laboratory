import ko = require('knockout');

import BaseComputer = require('controller/view/computer/Base');
import experimentController = require('controller/Experiment');

import MouseModel = require('model/Mouse');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import ActivationType = require('model/type/Activation');
import ComputerScreenType = require('model/type/ComputerScreen');

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
        this.selectedMouse = ko.pureComputed(() => {
            return this.availableMice()[this.selectedIndex()];
        });

        ko.rebind(this);
    }

    orderMouse() {
        var mouse = this.selectedMouse();
        this.gameState.inventory.add(mouse.clone());

        this.changeScreen(ComputerScreenType.MENU);

        experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_MOUSE, mouse);
    }
}

export = OrderMouse;
