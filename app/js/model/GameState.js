// Global singleton game state

define([
    'knockout',
    'base',
    'model/Inventory',
    'model/Mouse',
    'model/Worktable1',
    'model/Worktable2',
    'model/Fumehood',
    'model/Incubator',
    'model/SpectroPM',
    'model/Fermentor',
    'model/UvRoom',
    'model/Washing',
    'model/type/MouseBlood',
    'model/type/ComputerScreen'
], function (ko, Base, Inventory, MouseModel, Worktable1Model,
             Worktable2Model, FumehoodModel, IncubatorModel,
             SpectroPMModel, FermentorModel, UvRoomModel, WashingModel, MouseBloodType, ComputerScreenType) {

    var GameState = Base.extend({

        currentExercise: ko.observable(),
        activeComputerScreen: ko.observable(ComputerScreenType.MENU),

        inventory: new Inventory(),

        mouse: new MouseModel(MouseBloodType.DIABETIC),
        worktable1: new Worktable1Model(),
        worktable2: new Worktable2Model(),
        fumehood: new FumehoodModel(),
        incubator: new IncubatorModel(),
        spectroPM: new SpectroPMModel(),
        fermentor: new FermentorModel(),
        uvroom: new UvRoomModel(),
        washing: new WashingModel()
    });

    // Note that we're returning an instance
    return new GameState();
});
