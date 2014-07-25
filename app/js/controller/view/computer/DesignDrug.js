define([
    'knockout',
    'jquery',

    'controller/view/computer/Base',
    'controller/Popup',

    'service/Drug',

    'factory/Container',

    'model/GameState',

    'utils/utils'
], function (ko, $, BaseComputer, popupController, drugService, ContainerFactory, gameState, utils) {

    var DesignDrug = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-design-drug', 'computer.screen.drug');

            self.drugService = drugService;
            self.sidegroups = drugService.sidegroups;
            self.popupController = popupController;

            self.getEmptyScaffold = function () {
                return self.drugService.getScaffold("1");
            };

            self.selectedScaffold = ko.observable(self.getEmptyScaffold());

            self.showSidegroupInfo = function (sidegroup) {
                self.popupController.kvInfo(sidegroup.info);
            };

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
                });

                return dragger;
            };

            self.getInfo = function () {
                self.drugService.getDrugInfo(self.selectedScaffold().configurationString())
                    .then(function (info) {
                        self.popupController.kvInfo(info);
                    });
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
