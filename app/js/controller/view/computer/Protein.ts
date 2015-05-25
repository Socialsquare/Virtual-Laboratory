import ko = require('knockout');

import BaseComputer = require('controller/view/computer/Base');

import LiquidType = require('model/type/Liquid');

import LiquidModel = require('model/Liquid');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');

import TextHelper = require('utils/TextHelper');

class Protein extends BaseComputer {

    public availableProteins: KnockoutObservableArray<LiquidModel>;
    public selectedIndex: KnockoutObservable<number>;
    public selectedProtein: KnockoutComputed<LiquidModel>;
    public TextHelper: TextHelper;

    constructor() {
        super('computer-order-protein', 'computer.screen.protein');

        this.TextHelper = TextHelper;

        this.availableProteins = ko.observableArray([
            LiquidFactory.insulin(),
            LiquidFactory.lipase(),
            LiquidFactory.antibodyGout(),
            LiquidFactory.antibodySmallpox()
        ]);

        this.selectedIndex = ko.observable(0);
        this.selectedProtein = ko.computed(() => {
            return this.availableProteins()[this.selectedIndex()];
        });
    }

    public orderProtein = () => {
        var liquid = null;

        switch (this.selectedProtein().type()) {
        case LiquidType.INSULIN:
            liquid = LiquidFactory.insulin();
            break;
        case LiquidType.LIPASE_ENZYME:
            liquid = LiquidFactory.lipase();
            break;
        case LiquidType.ANTIBODY_GOUT:
            liquid = LiquidFactory.antibodyGout();
            break;
        case LiquidType.ANTIBODY_SMALLPOX:
            liquid = LiquidFactory.antibodySmallpox();
            break;
        }

        var item = ContainerFactory.tube().add(liquid, true);
        this.gameState.inventory.add(item);
    }
}

export = Protein;
