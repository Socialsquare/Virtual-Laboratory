define([
    'knockout',
    'utils/utils',
    'service/Localization',
    'model/SimpleContainer',
    'model/MicrotiterWells',
    'model/Tube',
    'model/type/Container',
    'model/type/AntigenCoating'
], function (ko, utils, LocalizationService, SimpleContainerModel, MicrotiterWellsModel, TubeModel,
             ContainerType, AntigenCoatingType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function (antigenCoatingType) {
            var self = this;
            self.base(ContainerType.MICROTITER, Math.pow(10, 12));
            self.antigenCoating = ko.observable(antigenCoatingType || AntigenCoatingType.NONE);
            self.microtiterWells = ko.observable(new MicrotiterWellsModel(antigenCoatingType)); // For how transfer of this works, see the pipette.


            self.isWellFluorescent = function (index) {
                if (self.isFluorescent())
                    return true;

                return self.microtiterWells().isWellFluorescent(index);
            };

            self.extractWellContents = function(inventory, hideMicrotiter, popupController, wellIndex) {

                popupController.confirm('microtiter.extract_well.header', 'microtiter.extract_well.body')
                    .then(function(){
                        //TODO: for experiments.json check for "acquisition of tube with myeloma"
                        // 1) clone microtiter contents and dilute 24x
                        // 2) clone relevant well to tube
                        // 3) reset relevant well in microtiter

                        var clonedLiqs = self.cloneLiquids();
                        clonedLiqs = utils.biology.dilute(24, clonedLiqs);

                        var clonedWell = self.microtiterWells().wells()[wellIndex].clone();
                        self.microtiterWells().wells()[wellIndex].reset();

                        var tube = new TubeModel();
                        tube.addAll(clonedLiqs);

                        tube.well = clonedWell;

                        inventory.add(tube, LocalizationService.text('microtiter.acquired_tube.label'));

                        hideMicrotiter();
                });


            };
        }
    });

    return Microtiterplate;
});
