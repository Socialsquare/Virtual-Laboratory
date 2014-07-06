define([
    'controller/Base',
    'knockout'
], function (BaseController, ko) {
    var Computer = BaseController.extend({
        activeScreen: ko.observable('menu'),

        constructor: function () {
            var self = this;
            this.base(1, 'computer');


            self.changeScreen = function (name) {
                console.log(name);
                self.activeScreen(name);
            };
        },


    });

    return Computer;
});
