define([
    'knockout',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/Syringe',
    'model/Bottle',
    'model/type/AntigenCoating'

], function (ko, Tube, Petridish, Microtiterplate, Syringe, Bottle, AntigenCoatingType) {

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

        microAntigenCoated: function () {
            return new Microtiterplate(AntigenCoatingType.ANY);
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
