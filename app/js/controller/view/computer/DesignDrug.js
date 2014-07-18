define([
    'knockout',
    'controller/view/computer/Base',
    'utils/utils',
    'service/Drug',
    'factory/Container',
    'model/GameState'
], function (ko, BaseComputer, utils, drugService, ContainerFactory, gameState) {

    var DesignDrug = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-design-drug', 'computer.screen.drug');

            self.drugService = drugService;
            self.sidegroups = drugService.sidegroups;

            self.getEmptyScaffold = function () {
                return self.drugService.getScaffold("1");
            };

            self.selectedScaffold = ko.observable(self.getEmptyScaffold());

            self.handleDrop = function (slot, group) {
                slot.sidegroup(group);
            };

            self.order = function () {
                var drug = ContainerFactory.tube().add(self.selectedScaffold());
                self.gameState.inventory.add(drug);

                self.selectedScaffold(self.getEmptyScaffold());
            };
        }
    });

    return DesignDrug;
});
