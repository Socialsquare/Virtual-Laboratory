define([
    'base',

    'model/GameState',
    'controller/Popup',

    'utils/Imager',
    'utils/DragHelper'
], function (Base, gameState, popupController, Imager, DragHelper) {

    var BaseViewController = Base.extend({

        gameState: gameState,
        Imager: Imager,
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
