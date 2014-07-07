// Global singleton game state

define([
    'knockout',
    'base',
    'model/Mouse',
    'model/Worktable1',
    'model/Worktable2'
], function (ko, Base, MouseModel, Worktable1Model, Worktable2Model) {
    var GameState = Base.extend({

        activeExperiment: ko.observable(),

        inventory: ko.observableArray(),

        mouse: ko.observable(new MouseModel()),
        worktable1: ko.observable(new Worktable1Model()),
        worktable2: ko.observable(new Worktable2Model()),

        addInventoryItem: function (item) {
            this.inventory.push(item);
        }
    });

    // Note that we're returning an instance
    return new GameState();
});
