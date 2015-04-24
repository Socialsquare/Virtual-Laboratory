define([
    'knockout',
    'jquery',
    'model/Popup'
], function (ko, $, PopupModel) {

    var GuideModel = PopupModel.extend({

        constructor: function (experimentController, popupController) {
            var self = this;

            var viewData = {
                experiment: experimentController.activeExperiment(),
                activeTask: experimentController.activeTask()
            };

            self.experimentController = experimentController;
            self.base('popup-guide', viewData, popupController);

            self.postRender = function() {
                $('#popup-container .inner').scrollTop(self.experimentController.scrollAmount);
            };

            self.hide = function (domElement) {
                // var scrollableDom = domElement.parentElement.parentElement.getElementsByClassName('inner')[0];
                self.experimentController.scrollAmount = $('#popup-container .inner').scrollTop();

                self.popupController.hide(self);
            };
        }
    });

    return GuideModel;
});
