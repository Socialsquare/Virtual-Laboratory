define([
    'knockout',
    'base'
], function (ko, Base, popupController) {

    var PopupModel = Base.extend({

        constructor: function (data, popupController) {
            var self = this;

            self.data = data;
            self.popupController = popupController;
        }
    });

    return PopupModel;
});
