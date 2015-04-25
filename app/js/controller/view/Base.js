define(["require", "exports", 'knockout', 'base', 'model/GameState', 'model/type/Activation', 'controller/Router', 'controller/Popup', 'controller/Quiz', 'controller/Experiment', 'factory/Liquid', 'factory/Container', 'factory/SpecialItem', 'utils/ImageHelper', 'utils/DragHelper', 'model/type/Liquid'], function (require, exports, ko, Base, gameState, ActivationType, router, popupController, quizController, experimentController, LiquidFactory, ContainerFactory, SpecialItemFactory, ImageHelper, DragHelper, LiquidType) {
    var Base = (function () {
        function Base(templateName) {
            this.gameState = gameState;
            this.router = router;
            this.ImageHelper = ImageHelper;
            this.DragHelper = DragHelper;
            this.popupController = popupController;
            this.quizController = quizController;
            this.experimentController = experimentController;
            this.liquidFactory = LiquidFactory;
            this.containerFactory = ContainerFactory;
            this.specialItemFactory = SpecialItemFactory;
            this.ActivationType = ActivationType;
            this.templateName = templateName;
            this.hasMenu = ko.observable(true);
            // false = CAN show pipette.
            this.shouldHidePipette = ko.observable(false);
        }
        Base.prototype.maybeHidePippete = function () {
            if (this.gameState.pipette.active()
                && this.shouldHidePipette()) {
                this.gameState.pipette.active.toggle();
            }
        };
        Base.prototype.enter = function () {
            this.maybeHidePippete();
        };
        Base.prototype.exit = function () { };
        // TODO: move to utility class?
        Base.prototype.smallPoxGuard = function (position, container) {
            if (container.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                this.popupController.message('fumehood.smallpox.header', 'fumehood.smallpox.body');
                return false;
            }
            return true;
        };
        return Base;
    })();
    return Base;
});
