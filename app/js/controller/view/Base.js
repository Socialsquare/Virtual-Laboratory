define([
    'knockout',
    'base',

    'model/GameState',
    'model/type/Activation',

    'controller/Router',
    'controller/Popup',
    'controller/Quiz',
    'controller/Experiment',

    'factory/Liquid',
    'factory/Container',
    'factory/SpecialItem',

    'utils/ImageHelper',
    'utils/DragHelper'

], function (ko, Base, gameState, ActivationType, router, popupController,
             quizController, experimentController,
             LiquidFactory, ContainerFactory, SpecialItemFactory,
             ImageHelper, DragHelper) {

    var Base = Base.extend({

        gameState: gameState,
        router: router,
        ImageHelper: ImageHelper,
        DragHelper: DragHelper,
        popupController: popupController,
        quizController: quizController,
        experimentController: experimentController,
        liquidFactory: LiquidFactory,
        containerFactory: ContainerFactory,
        specialItemFactory: SpecialItemFactory,
        ActivationType: ActivationType,

        constructor: function (templateName) {
            var self = this;

            self.templateName = templateName;
            self.hasMenu = ko.observable(true);
        },

        enter: function () {},

        exit: function () {}
    });

    return Base;
});
