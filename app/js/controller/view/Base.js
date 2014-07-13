define([
    'knockout',
    'base',

    'model/GameState',
    'controller/Router',
    'controller/Popup',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, Base, gameState, router, popupController, ImageHelper, DragHelper) {

    var Base = Base.extend({

        gameState: gameState,
        router: router,
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

    return Base;
});
