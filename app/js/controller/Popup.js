define([
    'knockout',
    'jquery',
    'base',
    'lodash',
    'model/Popup',
    'utils/TextHelper',

    'controller/Video'
], function (ko, $, Base, _, PopupModel, TextHelper, VideoController) {

    var Popup = Base.extend({

        constructor: function () {
            var self = this;

            self.activeNotifications = ko.observableArray([]);
            self.activeNotification = ko.computed(function () {
                return !self.activeNotifications.isEmpty();
            });

            self.activePopups = ko.observableArray([]);
            self.activePopup = ko.computed(function () {
                return !self.activePopups.isEmpty();
            });

            self.show = function (name, viewData, asNotification) {
                var vm = new PopupModel(name, viewData, self);
                if (asNotification)
                    self.activeNotifications.push(vm);
                else
                    self.activePopups.push(vm);
                return vm;
            };

            self.hide = function (popup) {
                self.activePopups.remove(popup);
                self.activeNotifications.remove(popup);
            };

            self.kvInfo = function (info) {
                self.show('popup-kv-info', { info: info });
            };

            self.dnaInfo = function (dna) {
                self.show('popup-dna-info', { dna: dna });
            };

            self.message = function (title, message) {
                self.show('popup-message', { title: title, message: message });
            };

            self.microtiterCloseUp = function(microtiter) {
                self.show('popup-microtiter', {title: 'syringe.emptied.header', message: 'syringe.emptied.header', wells: ['lala',2,'rigtig meget nice data',4]});
            };

            self.dataExport = function (data) {
                self.show('popup-data-export', { csvData: data });
            };

            self.notify = function(title, message, closingTime) {
                var delay = closingTime || 3000;

                var vm = self.show('popup-notify', { title: title, message: message }, true);
                _.delay(function () {
                    self.hide(vm);
                }, delay);
            };

            self.itemDetail = function (item) {
                self.show('popup-item-detail', { item: item });
            };

            self.confirm = function (title, message) {
                var promise = $.Deferred();
                var vm = self.show('popup-dialog', { title: title, message: message, promise: promise });
                return promise.always(function () {
                    self.hide(vm);
                });
            };

            self.video = function (sequence, controlsRequired) {
                var videoController = new VideoController();
                var vm = self.show('popup-video', { videoController: videoController });
                return videoController.play(sequence, false, controlsRequired).done(function () {
                    self.hide(vm);
                });
            };

            self.select = function (title, message, options) {
                var selected = ko.observable();
                var promise = $.Deferred();

                var vm = self.show('popup-select', {
                    title: title,
                    message: message,
                    options: options,
                    selected: selected,
                    promise: promise });

                return promise.always(function () {
                    self.hide(vm);
                });
            };
        }
    });

    return new Popup();
});
