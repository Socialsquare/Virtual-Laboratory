// Global singleton game state

define([
    'knockout',
    'base',
    'model/Mouse'
], function (ko, Base, MouseModel) {
    var GameState = Base.extend({

        activeExperiment: ko.observable(),

        inventory: ko.observableArray(),

        mouse: ko.observable(new MouseModel()),

        addInventoryItem: function (item) {
            this.inventory.push(item);
        }
    });

    // Note that we're returning an instance
    return new GameState();
});
