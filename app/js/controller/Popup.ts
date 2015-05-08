import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');
import PopupModel = require('model/Popup');
import GuideModel = require('model/Guide');
import HelpPopupModel = require('model/HelpPopup');
import TextHelper = require('utils/TextHelper');
import ImageHelper = require('utils/ImageHelper');
import VideoController = require('controller/Video');

interface SelectOption<T> {
    key: string;
    value: T;
}

class Popup {
    // Used for testing TODO! could be nicer
    public autoConfirm: boolean = false;

    public imageHelper: any;
    public activeNotification: any;
    public activeNotifications: any;

    public activePopups: any;
    public activePopup: any;

    private helpPopupModel: any;

    constructor() {
        this.helpPopupModel = new HelpPopupModel(this);

        this.imageHelper = ImageHelper;
        this.activeNotifications = ko.observableArray([]);
        this.activeNotification = ko.computed(() => {
            return !this.activeNotifications.isEmpty();
        });

        this.activePopups = ko.observableArray([]);
        this.activePopup = ko.computed(() => {
            return !this.activePopups.isEmpty();
        });

        ko.rebind(this);
    }

    show(name, viewData = {}, asNotification = false) {
        var vm = new PopupModel(name, viewData, this);
        if (asNotification)
            this.activeNotifications.push(vm);
        else
            this.activePopups.push(vm);
        return vm;
    }

    showGuide(experimentController) {
        var vm = new GuideModel(experimentController, this);
        this.activePopups.push(vm);
        return vm;
    }

    hide(popup) {
        this.activePopups.remove(popup);
        this.activeNotifications.remove(popup);
    }

    kvInfo(info) {
        this.show('popup-kv-info', { info: info });
    }

    dnaInfo(dna) {
        this.show('popup-dna-info', { dna: dna });
    }

    message(title, message) {
        this.show('popup-message', { title: title, message: message });
    }

    microtiterCloseUp(microtiter) {

        this.show('popup-microtiter', microtiter);
    }

    dataExport(data) {
        this.show('popup-data-export', { csvData: data });
    }

    notify(title, message, closingTime = 3000) {
        var delay = closingTime;

        var vm = this.show('popup-notify', { title: title, message: message }, true);
        _.delay(() => {
            this.hide(vm);
        }, delay);
    }

    itemDetail(item) {
        this.show('popup-item-detail', { item: item });
    }

    confirm(title, message) {
        var promise = $.Deferred();
        var vm = this.show('popup-dialog', { title: title, message: message, promise: promise });

        if (this.autoConfirm) {
            promise.resolve();
        }

        return promise.always(() => {
            this.hide(vm);
        });
    }

    video(sequence, controlsRequired) {
        var videoController = new VideoController();
        var vm = this.show('popup-video', { videoController: videoController });
        return videoController.play(sequence, false, controlsRequired).done(() => {
            this.hide(vm);
        });
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
        this.activePopups.push(this.helpPopupModel);
        return this.helpPopupModel;
    }
}

export = new Popup();
