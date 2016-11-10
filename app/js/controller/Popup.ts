import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

import i18n = require('service/Localization');
import ImageHelper = require('utils/ImageHelper');

import MicrotiterplateModel = require('model/Microtiterplate');
import ExperimentModel = require('model/Experiment');

// Needed for to trigger events on popup
import ActivationType = require('model/type/Activation');
import TubeExtractionType = require('model/type/TubeExtraction');

import PopupModel = require('model/Popup');
import GuidePopupModel = require('model/popup/Guide');
import MicrotiterPopupModel = require('model/popup/Microtiter');
import HelpPopupModel = require('model/popup/Help');
import ListPopupModel = require('model/popup/List');
import DoorPopupModel = require('model/popup/Door');
import TubeExtractionPopupModel = require('model/popup/TubeExtraction');

import SelectOption = require('controller/SelectOption');
import VideoController = require('controller/Video');

class Popup {
    // Used for testing TODO! could be nicer
    public autoConfirm: boolean = false;

    public imageHelper: ImageHelper;

    public activeNotification: KnockoutComputed<boolean>;
    public activeNotifications: KnockoutObservableArray<PopupModel>;

    public activePopup: KnockoutComputed<boolean>;
    public activePopups: KnockoutObservableArray<PopupModel>;

    private helpPopupModel: HelpPopupModel;
    private guidePopupModel: GuidePopupModel;

    constructor() {
        this.helpPopupModel = new HelpPopupModel();
        this.guidePopupModel = new GuidePopupModel(null);

        this.imageHelper = ImageHelper;
        this.activeNotifications = ko.observableArray([]);
        this.activeNotification = ko.pureComputed(() => !this.activeNotifications.isEmpty());

        this.activePopups = ko.observableArray([]);
        this.activePopup = ko.pureComputed(() => !this.activePopups.isEmpty());

        ko.rebind(this);
    }

    show(name, viewData = {}, asNotification = false) {
        var popup = new PopupModel(name, viewData, asNotification);
        return this.showPopup(popup);
    }

    showPopup(popup: PopupModel) {
        popup.onBeforeOpen()

        if (popup.isNotification) {
            this.activeNotifications.push(popup);
        } else {
            this.activePopups.push(popup);
        }

        popup.closePromise.then(() => this.hide(popup));

        return popup;
    }

    hide(popup: PopupModel) {
        this.activePopups.remove(popup);
        this.activeNotifications.remove(popup);
    }

    showGuide(experiment: ExperimentModel) {
        // this is a mess...
        this.guidePopupModel.experiment = experiment;
        this.guidePopupModel.resetPromise();
        return this.showPopup(this.guidePopupModel);
    }


    kvInfo(info) {
        info.passes = Object.keys(info.passes)
            .filter(o => info.passes[o] === true)
            .join(', ')
            .replace('canPassSkin', i18n.text('kv-info.canPass.skin'))
            .replace('canPassBBB', i18n.text('kv-info.canPass.BBB'))
            .replace('canPassBlood', i18n.text('kv-info.canPass.blood'))
            .replace('canPassIntestine', i18n.text('kv-info.canPass.intestine'));
        this.show('popup-kv-info', { info: info });
    }

    dnaInfo(dna) {
        this.show('popup-dna-info', { dna: dna });
    }

    gelInfo(gel) {
        this.show('popup-gel-info', { gel: gel });
    }

    message(title: string, message: string, delayTime = 0) {
        _.delay(() => this.show('popup-message', { title: title, message: message }),
                delayTime);
    }

    microtiterCloseUp(microtiter: MicrotiterplateModel) {
        this.showPopup(new MicrotiterPopupModel(microtiter));
    }

    dataExport(data) {
        this.show('popup-data-export', { csvData: data });
    }

    notify(title: string, message: string, closingTime: number = 3000, succes: boolean = false) {
        var vm = this.show('popup-notify', {title: title, message: message, succes: succes}, true);
        _.delay(() => this.hide(vm), closingTime);
    }

    itemDetail(item) {
        const experimentController = require('controller/Experiment');
        this.show('popup-item-detail', { item: item });
        experimentController.triggerActivation(ActivationType.ITEM_DETAILS, item);
    }

    confirm(title: string, message: string, template?: string) {
        if (typeof template === 'undefined') {
            template = 'popup-dialog';
        }

        var promise = $.Deferred();
        var vm = this.show(template, {
            title: title,
            message: message,
            promise: promise
        });

        if (this.autoConfirm)
            promise.resolve();

        return promise.always(() => this.hide(vm));
    }

    offer(title: string, message: string) {
        return this.confirm(title, message, 'popup-dialog-offer');
    }

    video(sequence: string | string[], controlsRequired: boolean, showClose = false) {
        var videoController = new VideoController();
        var vm = this.show('popup-video', { videoController: videoController, showClose: showClose });
        return videoController.play(sequence, false, controlsRequired)
        .done(() => this.hide(vm));
    }

    select<T>(title, message, options: SelectOption<T>[]) {
        var selected = ko.observable();
        var promise: JQueryDeferred<SelectOption<T>> = $.Deferred();
        var vm = this.show('popup-select', {
            title: title,
            message: message,
            options: options,
            selected: selected,
            promise: promise });

        return promise.always(() => this.hide(vm));
    }

    labInfo() {
        this.helpPopupModel.resetPromise();
        return this.showPopup(this.helpPopupModel);
    }

    chemicalList<T>(title: string, items: T[], itemTakenCallback: (T) => void) {
        var listPopup = new ListPopupModel<T>(title, items, itemTakenCallback);
        return this.showPopup(listPopup);
    }

    showDoor() {
        this.showPopup(new DoorPopupModel());
    }

    tubeExtraction(type: TubeExtractionType) {
        var vm = <TubeExtractionPopupModel>this.showPopup(new TubeExtractionPopupModel(type));

        return vm.promise.always(() => this.hide(vm));
    }
}

export = new Popup();
