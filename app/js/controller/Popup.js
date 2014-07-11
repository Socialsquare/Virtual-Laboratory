define([
    'knockout',
    'base',
    'model/Popup'
], function (ko, Base, PopupModel) {

    var PopupController = Base.extend({

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
        }
    });

    return new PopupController();
});
