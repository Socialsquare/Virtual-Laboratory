define([
    'knockout',
    'controller/view/Base',
    'controller/ExerciseSelector'
], function (ko, BaseViewController, ExerciseSelectorController) {

    var Welcome = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('welcome');
            self.hasMenu(false);

            self.exerciseSelectorController = new ExerciseSelectorController();
        },
    });

    return Welcome;
});
