define([
    'knockout',
    'base',
    'model/GameState'
], function (ko, Base, gameState) {

    var MenuController = Base.extend({

        gameState: gameState,

        fullscreen: function () {
            console.log('TODO: Go fullscreen');
        },

        selectExperiment: function () {
            console.log('TODO: Select experiment');
        },

        handleDrop: function (event, $draggable) {
            var item = $draggable.data('content');

		    $draggable.off();
		    $draggable.chcDraggable('destroy');
            $draggable.remove();

		    gameState.addInventoryItem(item);
	    }
    });

    return MenuController;
});
