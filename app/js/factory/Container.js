define([
    'knockout',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate'

], function (ko, Tube, Petridish, Microtiterplate) {

    var Container = {
        tube: function () {
            return new Tube();
        },

        petri: function () {
            return new Petridish();
        },

        micro: function () {
            return new Microtiterplate();
        }
    };

    return Container;
});
