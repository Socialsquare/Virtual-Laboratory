define([
    'knockout',
    'base',
    'model/GameState',
    'utils/Imager'
], function (ko, Base, gameState, Imager) {

    var MenuController = Base.extend({

        gameState: gameState,

        Imager: Imager,

        constructor: function () {
            self.fullscreen = function () {
                console.log('TODO: Go fullscreen');
            };

            self.selectExperiment = function () {
                console.log('TODO: Select experiment');
            };
        },

        // handleDrop: function (event, $draggable) {
        //     var item = $draggable.data('content');

		//     $draggable.off();
		//     $draggable.chcDraggable('destroy');
        //     $draggable.remove();

		//     gameState.inventory.add(item);
	    // },

        // startDragItem: function (event) {
        //     var item = gameState.inventory.get(event.target.dataset.uid);
        //     gameState.draggingItem(item);
        // }
    });

    return MenuController;
});
