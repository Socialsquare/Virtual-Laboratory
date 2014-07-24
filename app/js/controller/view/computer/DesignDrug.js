define([
    'knockout',
    'jquery',
    'controller/view/computer/Base',
    'utils/utils',
    'service/Drug',
    'factory/Container',
    'model/GameState'
], function (ko, $, BaseComputer, utils, drugService, ContainerFactory, gameState) {

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

            self.handleTrashDrop = function (slot) {
                slot.sidegroup(null);
            };

            self.handleDrop = function (slot, group) {
                slot.sidegroup(group);
            };

            self.slotDraggingHelper = function (slot) {
                var dragger = $('<div>');

                $.get(slot.sidegroup().file(), function (data) {
                    var svgNode = $("svg", data);
	                var docNode = document.adoptNode(svgNode[0]);
                    dragger.html(docNode);
                    console.log(dragger);
                });

                return dragger;
            };

            self.order = function () {
                var drug = ContainerFactory.tube().add(self.selectedScaffold(), true);
                self.gameState.inventory.add(drug);

                self.selectedScaffold(self.getEmptyScaffold());

                self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_DRUG, drug);
            };
        }
    });

    return DesignDrug;
});
