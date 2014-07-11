define([
    'base',

    'model/GameState',

    'utils/Imager',
    'utils/DragHelper'
], function (Base, gameState, Imager, DragHelper) {

    var BaseViewController = Base.extend({

        gameState: gameState,
        Imager: Imager,
        DragHelper: DragHelper,

        constructor: function (templateName) {
            this.templateName = templateName;
        },

        enter: function () {},

        exit: function () {}
    });

    return BaseViewController;
});
