define([
    'knockout',
    'base',

    'model/GameState',
    'controller/Popup',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, Base, gameState, popupController, ImageHelper, DragHelper) {

    var BaseViewController = Base.extend({

        gameState: gameState,
        ImageHelper: ImageHelper,
        DragHelper: DragHelper,
        popupController: popupController,

        constructor: function (templateName) {
            this.templateName = templateName;
            this.hasMenu = ko.observable(true);
        },

        enter: function () {},

        exit: function () {}
    });

    return BaseViewController;
});
