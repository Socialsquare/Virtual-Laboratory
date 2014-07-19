define([
    'knockout',
    'base',

    'model/GameState',
    'controller/Router',
    'controller/Popup',
    'controller/Experiment',

    'factory/Liquid',
    'factory/Container',
    'factory/SpecialItem',

    'utils/ImageHelper',
    'utils/DragHelper'

], function (ko, Base, gameState, router, popupController, experimentController,
             LiquidFactory, ContainerFactory, SpecialItemFactory,
             ImageHelper, DragHelper) {

    var Base = Base.extend({

        gameState: gameState,
        router: router,
        ImageHelper: ImageHelper,
        DragHelper: DragHelper,
        popupController: popupController,
        experimentController: experimentController,
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
