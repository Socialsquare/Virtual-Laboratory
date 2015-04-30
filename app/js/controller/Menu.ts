import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');
import screenfull = require('screenfull');

import BaseViewController = require('controller/view/Base');
import popupController = require('controller/Popup');
import quizController = require('controller/Quiz');
import experimentController = require('controller/Experiment');

import gameState = require('model/GameState');

import TipModel = require('model/Tip');
import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');
import QuizModel = require('model/Quiz');

import ImageHelper = require('utils/ImageHelper');
import TextHelper = require('utils/TextHelper');
import DragHelper = require('utils/DragHelper');

class Menu extends BaseViewController {

    public ImageHelper = ImageHelper;
    public DragHelper = DragHelper;
    public popupController = popupController;
    public quizController = quizController;
    public gameState = gameState;

    // TODO: hardcoded width :*(
    public inventoryWidth = 462;
    public scrollInterval = null;
    public scrollRight = false;
    public scrollValue = ko.observable(0);

    public canScroll: KnockoutComputed<boolean>;

    constructor() {
        super('menu');

        this.gameState.inventory.items.subscribe(() => {
            this.boundScroll();
        });

        this.canScroll = ko.computed(() => {
            return this.inventoryItemsWidth() > this.inventoryWidth;
        });

    }

    public scrollInventory = (scrollRight) => {
        this.stopScroll();

        if (!this.canScroll())
            return;

        this.scrollRight = scrollRight;
        this.scrollInterval = window.setInterval(this.scrollStep, 20);
    }

    public scrollStep = () => {
        var diff = this.scrollRight ? -7 : 7;
        this.scrollValue(this.scrollValue() + diff);

        this.boundScroll();
    }

    public boundScroll = () => {
        if (!this.canScroll()) {
            this.scrollValue(0);
            this.stopScroll();
            return;
        }

        if (this.scrollValue() > 0) {
            this.scrollValue(0);
            this.stopScroll();
        }

        var maxVal = this.inventoryWidth - this.inventoryItemsWidth();
        if (this.scrollValue() < maxVal) {
            this.scrollValue(maxVal);
            this.stopScroll();
        }
    }

    public inventoryItemsWidth = () => {
        return this.gameState.inventory.items().length * 91;
    }

    public stopScroll = () => {
        window.clearInterval(this.scrollInterval);
    }

    public showInformation = () => {
        this.popupController.labInfo();
    }

    public selectExperiment = () => {
        this.router.navigate('loading');
    }

    public fullscreen = () => {
        var body = document.getElementsByTagName('body')[0];
        if (screenfull.enabled) {
            screenfull.toggle(body);
            $("#app").toggleClass('fullscreen', screenfull.isFullscreen);
        } else {
            alert('Full screen is not supported on your device :(');
        }
    }

    public inventoryDropHandler = (item) => {
        if (this.gameState.inventory.hasItem(item))
            return false;

        this.gameState.inventory.add(item);
    }

    public showGuide = () => {
        this.popupController.showGuide(experimentController);
    }

    public togglePipette = () => {
        this.gameState.pipette.active.toggle();
    }

    public tipDropHandler = (pipette) => {
        if (!this.gameState.pipette.hasTip()) {
            this.gameState.pipette.addAt(0, new TipModel());
        } else {
            this.popupController.notify('pipette.existing_tip.header', 'pipette.existing_tip.body');
        }
        return false;
    }

    public trashDropHandler = (item, consume) => {
        if (item.type() === ContainerType.PIPETTE) {
            this.gameState.pipette.removeTip();
        } else {
            this.popupController.confirm('popup.confirm_delete.header', 'popup.confirm_delete.body')
                .then(consume);
        }
        return false;
    }

    public showItemDetails = (item) => {
        var nonWriteables = [SpecialItemType.SCALPEL, SpecialItemType.SPLEEN,
                             SpecialItemType.WASH_BOTTLE, SpecialItemType.BUFFER];

        if (_.contains(nonWriteables, item.type()))
            this.popupController.message(TextHelper.prettyName(item), TextHelper.description(item));
        else
            this.popupController.itemDetail(item);
    }
}

export = Menu
