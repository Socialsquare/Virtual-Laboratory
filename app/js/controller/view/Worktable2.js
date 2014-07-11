define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController) {

    var Worktable2 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable2');

            self.worktable2 = self.gameState.worktable2;
        }

    });

    return Worktable2;
});
