define([
    'knockout',
    'base',
    'utils/ImageHelper',
    'utils/TextHelper'
], function (ko, Base, ImageHelper, TextHelper) {

    var PopupModel = Base.extend({

        constructor: function (templateName, data, popupController) {
            var self = this;

            self.data = data;
            self.templateName = templateName;
            self.ImageHelper = ImageHelper;
            self.TextHelper = TextHelper;
            self.popupController = popupController;

            self.hide = function () {
                self.popupController.hide(self);
            };

            self.postRender = function() {

            };
        }
    });

    return PopupModel;
});
