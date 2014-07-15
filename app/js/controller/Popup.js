define([
    'knockout',
    'base',
    'lodash',
    'model/Popup',
    'utils/TextHelper'
], function (ko, Base, _, PopupModel, TextHelper) {

    var Popup = Base.extend({

        constructor: function () {
            var self = this;

            self.active = ko.observable(false);
            self.templateName = ko.observable('');
            self.viewModel = ko.observable(null);

            self.show = function (name, viewData) {
                var vm = new PopupModel(viewData, this);

                self.templateName(name);
                self.viewModel(vm);
                self.active(true);
            };

            self.hide = function () {
                self.active(false);
                self.templateName('');
                self.viewModel(null);
            };

            self.message = function (title, message) {
                self.show('popup-message', { title: title, message: message });
            };

            self.notify = function(title, message, closingTime) {
                self.show('popup-notify', { title: title, message: message});
                _.delay(function(){
                    self.hide();
                    }, closingTime);
            };
            //TODO: implement discrete message (i.e. top left corner, fades after X seconds)

            self.itemDetail = function (item) {
                self.show('popup-item-detail', { item: item });
            };

            self.confirm = function (title, message, cb) {
                self.show('popup-dialog', { title: title, message: message, cb: function (answer) {
                    cb(answer);
                    self.hide();
                } });
            };
        }
    });

    return new Popup();
});
