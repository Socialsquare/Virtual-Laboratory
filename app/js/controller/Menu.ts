import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

// Utils
import ImageHelper = require('utils/ImageHelper');
import TextHelper = require('utils/TextHelper');
import DragHelper = require('utils/DragHelper');

// Models
import gameState = require('model/GameState');
import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');

// Controllers
import popupController = require('controller/Popup');
import quizController = require('controller/Quiz');
import experimentController = require('controller/Experiment');
import BaseViewController = require('controller/view/Base');

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
    public canScrollForward: KnockoutComputed<boolean>;
    public canScrollBackward: KnockoutComputed<boolean>;
    public pipetteIsVisible: KnockoutComputed<boolean>;

    constructor() {
        super('menu');

        gameState.inventory.items.subscribe(() => this.boundScroll());

        this.canScroll = ko.pureComputed(() => {
            return this.inventoryItemsWidth() > this.inventoryWidth;
        });

        this.canScrollForward = ko.pureComputed(() => {
            var maxVal = this.inventoryWidth - this.inventoryItemsWidth();
            return this.scrollValue() > maxVal
        });

        this.canScrollBackward = ko.pureComputed(() => {
            return this.scrollValue() < 0
        });

        this.pipetteIsVisible = ko.pureComputed(() =>
            gameState.pipette.active()
        )

        ko.rebind(this);
    }

    scrollInventory(scrollRight) {
        this.stopScroll();

        if (!this.canScroll())
            return;

        this.scrollRight = scrollRight;
        this.scrollInterval = window.setInterval(this.scrollStep, 20);
    }

    scrollStep() {
        var diff = this.scrollRight ? -7 : 7;
        this.scrollValue(this.scrollValue() + diff);

        this.boundScroll();
    }

    boundScroll() {
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

    inventoryItemsWidth() {
        // Add one to length, so the arrows appear when inventory is
        // "visually" full, to show the user there's more room
        const count = gameState.inventory.items().length + 1
        return count * 91;
    }

    stopScroll() {
        window.clearInterval(this.scrollInterval);
    }

    showInformation() {
        this.popupController.labInfo();
    }

    selectExperiment() {
        this.router.navigate('loading');
    }

    fullscreen() {
        var body = document.getElementsByTagName('body')[0];
        if (screenfull.enabled) {
            screenfull.toggle(body);
            $('#app').toggleClass('fullscreen', screenfull.isFullscreen);
        } else {
            alert('Full screen is not supported on your device :(');
        }
    }

    inventoryDropHandler(item) {
        if (gameState.inventory.hasItem(item))
            return false;

        gameState.inventory.add(item);
    }

    showGuide() {
        this.popupController.showGuide(experimentController.activeExperiment());
    }

    togglePipette() {
        gameState.pipette.active(!gameState.pipette.active());
    }

    showPipette() {
        gameState.pipette.active(true);
    }

    pipetteDown(event) {
        $('#pipette').trigger(event)
    }

    hidePipette() {
        gameState.pipette.active(false);
    }

    tipDropHandler(pipette) {
        if (!gameState.pipette.newTip()) {
            this.popupController.notify('pipette.existing_tip.header', 'pipette.existing_tip.body');
        }
        return false;
    }

    trashDropHandler(item, consume) {
        if (item.type() === ContainerType.PIPETTE) {
            gameState.pipette.removeTip();
        } else {
            this.popupController.confirm('popup.confirm_delete.header', 'popup.confirm_delete.body').then(consume);
        }
        return false;
    }

    showItemDetails(item) {
        var nonWriteables = [
            SpecialItemType.SCALPEL,
            SpecialItemType.SPLEEN,
            SpecialItemType.WASH_BOTTLE,
            SpecialItemType.BUFFER,
            ContainerType.GEL,
            SpecialItemType.MOUSE
        ];

        if (_.contains(nonWriteables, item.type()))
            this.popupController.message(TextHelper.prettyName(item), TextHelper.description(item));
        else
            this.popupController.itemDetail(item);
    }
}

export = Menu
