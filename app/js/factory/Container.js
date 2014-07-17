define([
    'knockout',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/Syringe'

], function (ko, Tube, Petridish, Microtiterplate, Syringe) {

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
        }
    };

    return Container;
});
