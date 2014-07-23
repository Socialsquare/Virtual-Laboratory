// Global singleton game state

define([
    'knockout',
    'base',
    'model/Inventory',
    'model/Mouse',
    'model/Pipette',
    'model/Worktable1',
    'model/Worktable2',
    'model/Fumehood',
    'model/Incubator',
    'model/SpectroPM',
    'model/Fermentor',
    'model/UvRoom',
    'model/Washing',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/ComputerScreen'
], function (ko, Base, Inventory, MouseModel, PipetteModel, Worktable1Model,
             Worktable2Model, FumehoodModel, IncubatorModel,
             SpectroPMModel, FermentorModel, UvRoomModel, WashingModel, MouseType, MouseBloodType, ComputerScreenType) {

    var GameState = Base.extend({
        constructor: function () {
            var self = this;

            self.activeComputerScreen = ko.observable(ComputerScreenType.MENU);
            self.mouse = ko.observable(new MouseModel(MouseType.HEALTHY, MouseBloodType.NORMAL));
            self.sequencedDNA = ko.observableArray([]);
            self.inventory = new Inventory();
            self.pipette = new PipetteModel();

            self.worktable1 = new Worktable1Model();
            self.worktable2 = new Worktable2Model();
            self.fumehood = new FumehoodModel();
            self.incubator = new IncubatorModel();
            self.spectroPM = new SpectroPMModel();
            self.fermentor = new FermentorModel();
            self.uvroom = new UvRoomModel();
            self.washing = new WashingModel();

            self.reset = function () {
                self.activeComputerScreen(ComputerScreenType.MENU);
                self.sequencedDNA.removeAll();
                self.mouse(new MouseModel(MouseType.HEALTHY, MouseBloodType.NORMAL));

                self.inventory.reset();

                self.pipette.removeTip();
                self.worktable1.reset();
                self.worktable2.reset();
                self.fumehood.reset();
                self.incubator.reset();
                self.spectroPM.reset();
                self.fermentor.reset();
                self.uvroom.reset();
                self.washing.reset();
            };
        }
    });

    // Note that we're returning an instance
    return new GameState();
});
