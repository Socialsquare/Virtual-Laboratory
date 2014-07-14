define([
    'knockout',
    'base',
    'utils/ImageHelper'
], function (ko, Base, ImageHelper) {

    var PopupModel = Base.extend({

        constructor: function (data, popupController) {
            var self = this;

            self.data = data;
            self.ImageHelper = ImageHelper;
            self.popupController = popupController;
        }
    });

    return PopupModel;
});
