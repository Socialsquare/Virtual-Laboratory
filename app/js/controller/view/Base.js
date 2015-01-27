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
    'utils/DragHelper',

    'model/type/Liquid'

], function (ko, Base, gameState, ActivationType, router, popupController,
             quizController, experimentController,
             LiquidFactory, ContainerFactory, SpecialItemFactory,
             ImageHelper, DragHelper, LiquidType) {

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
            self.shouldHidePipette = ko.observable(false); // false --> CAN show pipette.

            // TODO: move to utility class?
            self.smallPoxGuard = function(position, container) {
                if ( container.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                    self.popupController.message('fumehood.smallpox.header', 'fumehood.smallpox.body');
                    return false;
                }
                return true;
            };
        },

        maybeHidePippete: function () {
            if (this.gameState.pipette.active()
                && this.shouldHidePipette()) {
                this.gameState.pipette.active.toggle();
            }
        },

        enter: function () {
            this.maybeHidePippete();
        },

        exit: function () {}
    });

    return Base;
});
