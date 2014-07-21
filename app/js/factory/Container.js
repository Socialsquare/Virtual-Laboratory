define([
    'knockout',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/Syringe',
    'model/Bottle'

], function (ko, Tube, Petridish, Microtiterplate, Syringe, Bottle) {

    var Container = {
        tube: function () {
            return new Tube();
        },

        petri: function () {
            return new Petridish();
        },

        micro: function () {
            return new Microtiterplate();
        },

        syringe: function () {
            return new Syringe();
        },

        bottle: function () {
            return new Bottle();
        }
    };

    return Container;
});
