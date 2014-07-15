define([
    'knockout',
    'base',

    'model/GameState',
    'controller/Router',
    'controller/Popup',

    'factory/Liquid',
    'factory/Container',
    'factory/SpecialItem',

    'utils/ImageHelper',
    'utils/DragHelper'

], function (ko, Base, gameState, router, popupController,
             LiquidFactory, ContainerFactory, SpecialItemFactory,
             ImageHelper, DragHelper) {

    var Base = Base.extend({

        gameState: gameState,
        router: router,
        ImageHelper: ImageHelper,
        DragHelper: DragHelper,
        popupController: popupController,
        liquidFactory: LiquidFactory,
        containerFactory: ContainerFactory,
        specialItemFactory: SpecialItemFactory,

        constructor: function (templateName) {
            this.templateName = templateName;
            this.hasMenu = ko.observable(true);
        },

        enter: function () {},

        exit: function () {}
    });

    return Base;
});
