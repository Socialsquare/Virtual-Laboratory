import ko = require('knockout');
import $ = require('jquery');
import is = require('is');

import BaseViewController = require('controller/view/Base');
import ExperimentSelectorController = require('controller/ExperimentSelector');
import PopupController = require('controller/Popup');
import localizationService = require('service/Localization');

import FeatureHelper = require('utils/FeatureHelper');
import gameState = require('model/GameState');

class Loading extends BaseViewController {

    public percent: KnockoutObservable<number>;
    public isLoaded: KnockoutObservable<boolean>;
    public hasMenu: KnockoutObservable<boolean>;
    public experimentSelectorController: ExperimentSelectorController;

    constructor() {
        super('loading');

        gameState.pipette.active(false);
        this.hasMenu = ko.observable(false);
        this.percent = ko.observable(0);
        this.isLoaded = ko.observable(false);

        $.html5Loader({
            filesToLoad: '../../assets/preload.json',
            // debugMode: true,
            onUpdate: (progress) => this.percent(progress),
            onComplete: () => this.isLoaded(true)
        });

        this.experimentSelectorController = new ExperimentSelectorController();

        ko.rebind(this);
    }

    selectLang(langCode) {
        localizationService.setLanguage(langCode);
    }

    selectedLanguage() {
        return localizationService.selectedLanguage();
    }

    isGoodBrowser() {
        return is.not.desktop() || is.chrome() || is.firefox();
    }

    enter() {
        gameState.pipette.active(false);
        this.experimentSelectorController.selected(null);

        if (FeatureHelper.homeScreen && !window.navigator.standalone) {
            PopupController.message('popup.home_screen.header', 'popup.home_screen.body');
        }

        if (!this.isGoodBrowser()) {
            PopupController.message('popup.bad_browser.header', 'popup.bad_browser.body');
        }
    }
}

export = Loading;
