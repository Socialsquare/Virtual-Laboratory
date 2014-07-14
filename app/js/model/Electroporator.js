define([
    'knockout',
    'lodash',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, _, SimpleContainerModel, ContainerType) {

    var Electroporator = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.ELECTROPORATOR, Math.pow(10, 13));

            self.status = ko.observable(false);

            self.activate = function () {
                self.status(true);

                _.delay(self.status, 1000, false);

                /*_.each(self.liquids(), function(gene){
                    if(gene.type() === LiquidType.GENE) {// TODO: 1) For hver liquid som er et "Gene"

                        alert('Such gene!');

                        // TODO:1.1) Overfør Gene til hver microorganisme
                        self.transferGeneToAllOrganisms(gene);

                        // TODO: 1.2) Kontrollér om det er korrekt designet
                        var newProperties = self.verifyGene(gene);
                    }
                });*/

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
