define([
    'knockout',
    'model/SimpleContainer',
    'model/MicrotiterWells',
    'model/type/Container',
    'model/type/AntigenCoating'
], function (ko, SimpleContainerModel, MicrotiterWellsModel, ContainerType, AntigenCoatingType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function (antigenCoatingType) {
            var self = this;
            self.base(ContainerType.MICROTITER, Math.pow(10, 10));
            self.antigenCoating = ko.observable(antigenCoatingType || AntigenCoatingType.NONE);
            self.microtiterWells = ko.observable(new MicrotiterWellsModel(antigenCoatingType)); // For how transfer of this works, see the pipette.


            self.isWellFluorescent = function (index) {
                if (self.isFluorescent())
                    return true;

                return self.microtiterWells().isWellFluorescent(index);
            };
        }
    });

    return Microtiterplate;
});
