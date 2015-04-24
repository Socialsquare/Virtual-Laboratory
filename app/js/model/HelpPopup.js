define([
    'knockout',
    'jquery',
    'lodash',
    'base',

    'controller/Router',

    'service/Help',
    'model/Popup'
], function (ko, $, _, Base, router, helpService, PopupModel) {

    var Help = PopupModel.extend({

        constructor: function (popupController) {
            var self = this;
            self.base('popup-instruments', self, popupController);

            self.entries = helpService.getHelpEntries();
            self.selectedEntry = ko.observable(self.entries[0]);

            self.selectEntry = function(entry) {
                self.selectedEntry(entry);
            };

            self.goToArea = function () {
                var entry = self.selectedEntry();

                if (entry.route) {
                    router.navigate(entry.route);

                    self.hide();
                }
            };
        }
    });

    return Help;
});
