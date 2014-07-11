define([
    'base',

    'model/GameState',
    'controller/Popup',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (Base, gameState, popupController, ImageHelper, DragHelper) {

    var BaseViewController = Base.extend({

        gameState: gameState,
        ImageHelper: ImageHelper,
        DragHelper: DragHelper,
        popupController: popupController,

        constructor: function (templateName) {
            this.templateName = templateName;
        },

        enter: function () {},

        exit: function () {}
    });

    return BaseViewController;
});
