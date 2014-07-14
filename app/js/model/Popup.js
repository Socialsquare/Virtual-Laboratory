define([
    'knockout',
    'base',
    'utils/ImageHelper',
    'utils/TextHelper'
], function (ko, Base, ImageHelper, TextHelper) {

    var PopupModel = Base.extend({

        constructor: function (data, popupController) {
            var self = this;

            self.data = data;
            self.ImageHelper = ImageHelper;
            self.TextHelper = TextHelper;
            self.popupController = popupController;
        }
    });

    return PopupModel;
});
