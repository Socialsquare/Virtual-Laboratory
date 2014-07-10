// Global singleton game state

define([
    'knockout',
    'base',
    'model/Inventory',
    'model/Mouse',
    'model/Worktable1',
    'model/Worktable2',
    'model/Fumehood'
], function (ko, Base, Inventory, MouseModel, Worktable1Model, Worktable2Model, FumehoodModel) {
    var GameState = Base.extend({

        inventory: new Inventory(),
        //draggingItem: ko.observable(null),

        //mouse: new MouseModel(),
        worktable1: new Worktable1Model(),
        worktable2: new Worktable2Model(),
        fumehood: new FumehoodModel()
    });

    // Note that we're returning an instance
    return new GameState();
});
