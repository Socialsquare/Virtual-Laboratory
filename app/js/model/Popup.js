define(["require", "exports", 'utils/ImageHelper', 'utils/TextHelper'], function (require, exports, ImageHelper, TextHelper) {
    var PopupModel = (function () {
        function PopupModel(templateName, data, popupController) {
            this.data = data;
            this.templateName = templateName;
            this.ImageHelper = ImageHelper;
            this.TextHelper = TextHelper;
            this.popupController = popupController;
        }
        PopupModel.prototype.hide = function () {
            this.popupController.hide(this);
        };
        PopupModel.prototype.postRender = function () {
            // noop
        };
        return PopupModel;
    })();
    return PopupModel;
});
