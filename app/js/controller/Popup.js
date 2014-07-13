define([
    'knockout',
    'base',
    'model/Popup'
], function (ko, Base, PopupModel) {

    var Popup = Base.extend({

        active: ko.observable(false),

        templateName: ko.observable(''),
        viewModel: ko.observable(null),

        constructor: function () {
            var self = this;

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
        }
    });

    return new Popup();
});
