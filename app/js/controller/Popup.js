define(["require", "exports", 'knockout', 'jquery', 'lodash', 'model/Popup', 'model/Guide', 'model/HelpPopup', 'utils/ImageHelper', 'controller/Video'], function (require, exports, ko, $, _, PopupModel, GuideModel, HelpPopupModel, ImageHelper, VideoController) {
    var Popup = (function () {
        function Popup() {
            var _this = this;
            this.helpPopupModel = new HelpPopupModel(this);
            this.imageHelper = ImageHelper;
            this.activeNotifications = ko.observableArray([]);
            this.activeNotification = ko.computed(function () {
                return !_this.activeNotifications.isEmpty();
            });
            this.activePopups = ko.observableArray([]);
            this.activePopup = ko.computed(function () {
                return !_this.activePopups.isEmpty();
            });
        }
        Popup.prototype.show = function (name, viewData, asNotification) {
            if (viewData === void 0) { viewData = {}; }
            if (asNotification === void 0) { asNotification = false; }
            var vm = new PopupModel(name, viewData, this);
            if (asNotification)
                this.activeNotifications.push(vm);
            else
                this.activePopups.push(vm);
            return vm;
        };
        Popup.prototype.showGuide = function (experimentController) {
            var vm = new GuideModel(experimentController, this);
            this.activePopups.push(vm);
            return vm;
        };
        Popup.prototype.hide = function (popup) {
            this.activePopups.remove(popup);
            this.activeNotifications.remove(popup);
        };
        Popup.prototype.kvInfo = function (info) {
            this.show('popup-kv-info', { info: info });
        };
        Popup.prototype.dnaInfo = function (dna) {
            this.show('popup-dna-info', { dna: dna });
        };
        Popup.prototype.message = function (title, message) {
            this.show('popup-message', { title: title, message: message });
        };
        Popup.prototype.microtiterCloseUp = function (microtiter) {
            this.show('popup-microtiter', microtiter);
        };
        Popup.prototype.dataExport = function (data) {
            this.show('popup-data-export', { csvData: data });
        };
        Popup.prototype.notify = function (title, message, closingTime) {
            var _this = this;
            var delay = closingTime || 3000;
            var vm = this.show('popup-notify', { title: title, message: message }, true);
            _.delay(function () {
                _this.hide(vm);
            }, delay);
        };
        Popup.prototype.itemDetail = function (item) {
            this.show('popup-item-detail', { item: item });
        };
        Popup.prototype.confirm = function (title, message) {
            var _this = this;
            var promise = $.Deferred();
            var vm = this.show('popup-dialog', { title: title, message: message, promise: promise });
            return promise.always(function () {
                _this.hide(vm);
            });
        };
        Popup.prototype.video = function (sequence, controlsRequired) {
            var _this = this;
            var videoController = new VideoController();
            var vm = this.show('popup-video', { videoController: videoController });
            return videoController.play(sequence, false, controlsRequired).done(function () {
                _this.hide(vm);
            });
        };
        Popup.prototype.select = function (title, message, options) {
            var _this = this;
            var selected = ko.observable();
            var promise = $.Deferred();
            var vm = this.show('popup-select', {
                title: title,
                message: message,
                options: options,
                selected: selected,
                promise: promise });
            return promise.always(function () { return _this.hide(vm); });
        };
        Popup.prototype.labInfo = function () {
            this.activePopups.push(this.helpPopupModel);
            return this.helpPopupModel;
        };
        return Popup;
    })();
    return new Popup();
});
