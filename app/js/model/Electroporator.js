define([
    'knockout',
    'lodash',
    'model/CompositeContainer',
    'model/ElectroporatorTank',
    'model/type/Container'
], function (ko, _, CompositeContainerModel, ElectroporatorTankModel, ContainerType) {
// TODO : let it extend composite
    var Electroporator = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.ELECTROPORATOR_TANK, ContainerType.ELECTROPORATOR);
            self.addAt(0, new ElectroporatorTankModel());

            self.status = ko.observable(false);

            self.activate = function () {
                self.status(true);

                _.delay(self.status, 1000, false);


// TODO: self.get(0)
                _.each(self.liquids(), function(gene){
                    if(gene.type() === LiquidType.GENE) {// TODO: 1) For hver liquid som er et "Gene"

                        alert('Such gene!');

                        // TODO:1.1) Overfør Gene til hver microorganisme
                        self.transferGeneToAllOrganisms(gene);

                        // TODO: 1.2) Kontrollér om det er korrekt designet
                        var newProperties = self.verifyGene(gene);
                    }
                });

                //TODO: implement
            };

            self.verifyGene = function(gene) {
                // TODO: fire videos & quizzes
                // TODO: implement
                return []; //TODO: if succesful, return an array of new properties
            };

            self.transferGeneToAllOrganisms = function (gene) {
                _.each(self.liquids(), function(microorganism) {
                    if(microorganism.type() === LiquidType.MICROORGANISM) {
                        // TODO: clone? what will happen if we don't clone?
                        microorganism.addGene(gene);
                    }
                });
            };

            //TODO:
            /*1) For hver liquid som er et "Gene"
            1.1) Overfør Gene til hver microorganisme
            1.2) Kontrollér om det er korrekt designet
            1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/



        }
    });

    return Electroporator;
});
