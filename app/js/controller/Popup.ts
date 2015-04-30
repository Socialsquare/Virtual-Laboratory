import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');
import PopupModel = require('model/Popup');
import GuideModel = require('model/Guide');
import HelpPopupModel = require('model/HelpPopup');
import TextHelper = require('utils/TextHelper');
import ImageHelper = require('utils/ImageHelper');
import VideoController = require('controller/Video');

class Popup {

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
    }

    public show = (name, viewData = {}, asNotification = false) => {
        var vm = new PopupModel(name, viewData, this);
        if (asNotification)
            this.activeNotifications.push(vm);
        else
            this.activePopups.push(vm);
        return vm;
    }

    public showGuide = (experimentController) => {
        var vm = new GuideModel(experimentController, this);
        this.activePopups.push(vm);
        return vm;
    }

    public hide = (popup) => {
        this.activePopups.remove(popup);
        this.activeNotifications.remove(popup);
    }

    public kvInfo = (info) => {
        this.show('popup-kv-info', { info: info });
    }

    public dnaInfo = (dna) => {
        this.show('popup-dna-info', { dna: dna });
    }

    public message = (title, message) => {
        this.show('popup-message', { title: title, message: message });
    }

    public microtiterCloseUp = (microtiter) => {

        this.show('popup-microtiter', microtiter);
    }

    public dataExport = (data) => {
        this.show('popup-data-export', { csvData: data });
    }

    public notify = (title, message, closingTime = 3000) => {
        var delay = closingTime;

        var vm = this.show('popup-notify', { title: title, message: message }, true);
        _.delay(() => {
            this.hide(vm);
        }, delay);
    }

    public itemDetail = (item) => {
        this.show('popup-item-detail', { item: item });
    }

    public confirm = (title, message) => {
        var promise = $.Deferred();
        var vm = this.show('popup-dialog', { title: title, message: message, promise: promise });
        return promise.always(() => {
            this.hide(vm);
        });
    }

    public video = (sequence, controlsRequired) => {
        var videoController = new VideoController();
        var vm = this.show('popup-video', { videoController: videoController });
        return videoController.play(sequence, false, controlsRequired).done(() => {
            this.hide(vm);
        });
    }

    public select = (title, message, options) => {
        var selected = ko.observable();
        var promise = $.Deferred();

        var vm = this.show('popup-select', {
            title: title,
            message: message,
            options: options,
            selected: selected,
            promise: promise });

        return promise.always(() => this.hide(vm));
    }

    public labInfo = () => {
        this.activePopups.push(this.helpPopupModel);
        return this.helpPopupModel;
    }
}

export = new Popup();
