define([
    'knockout',
    'jquery',
    'model/Popup'
], function (ko, $, PopupModel) {

    var GuideModel = PopupModel.extend({

        constructor: function (experimentController, popupController) {
            var viewData = {experiment: experimentController.activeExperiment(), activeTask: experimentController.activeTask()};
            var self = this;
            var templateName = 'popup-guide';
            self.experimentController = experimentController;
            self.base(templateName, viewData, popupController);

            self.postRender = function() {
                //popup-container
                popupContainerDom = $('#popup-container')[0];
                popupInner = popupContainerDom.getElementsByClassName('inner')[0];
                $(popupInner).scrollTop(self.experimentController.scrollAmount);
            };

            self.hide = function (domElement) {
                var scrollableDom = domElement.parentElement.parentElement.getElementsByClassName('inner')[0];
                self.experimentController.scrollAmount = scrollableDom.scrollTop;
                self.popupController.hide(self);
            };
        }
    });

    return GuideModel;
});

