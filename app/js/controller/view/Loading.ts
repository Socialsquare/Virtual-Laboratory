import ko = require('knockout');
import $ = require('jquery');

import BaseViewController = require('controller/view/Base');
import ExperimentSelectorController = require('controller/ExperimentSelector');

import localizationService = require('service/Localization');

import FeatureHelper = require('utils/FeatureHelper');

class Loading extends BaseViewController {

    constructor() {
        super('loading');

        this.shouldHidePipette(true);
        this.hasMenu(false);

        this.percent = ko.observable(0);
        this.isLoaded = ko.observable(false);
        this.localizationService = localizationService;

        $.html5Loader({
            filesToLoad: '../../assets/preload.json',
            // debugMode: true,
            onUpdate: (progress) => this.percent(progress),
            onComplete: () => this.isLoaded(true)
        });

        this.experimentSelectorController = new ExperimentSelectorController();

    }

    public selectLang = (langCode) => {
        this.localizationService.setLanguage(langCode);
    }

    public enter = () => {
        this.maybeHidePippete();
        this.experimentSelectorController.selected(null);

        if (FeatureHelper.homeScreen && !window.navigator.standalone) {
            this.popupController.message('popup.home_screen.header', 'popup.home_screen.body');
        }
    }
}

export = Loading;
