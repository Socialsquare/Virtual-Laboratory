define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController, gameState) {

    var Fumehood = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fumehood');

            self.fumehood = self.gameState.fumehood;
        }

    });

    return Fumehood;
});
