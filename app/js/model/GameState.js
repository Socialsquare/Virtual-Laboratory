// Global singleton game state

define([
    'knockout',
    'base'
], function (ko, Base) {
    var GameState = Base.extend({
        activeExperiment: ko.observable(),
        inventory: ko.observableArray(),

        addInventoryItem: function (item) {
            this.inventory.push(item);
        }
    });

    // Note that we're returning an instance
    return new GameState();
});
