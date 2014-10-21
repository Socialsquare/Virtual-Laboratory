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
                var popupInfo = {pKa: sidegroup.info.pKa, weight: sidegroup.info.weight};
                self.popupController.kvInfo(popupInfo);
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

            self.getHelp = function() {
                self.popupController.message('computer.screen.drug_design.help.header', 'computer.screen.drug_design.help.body');
            };

            self.order = function () {

                if (_.contains(self.selectedScaffold().configurationString(), 'R')) {
                    self.popupController.message('computer.screen.drug_design.cant_order.header', 'computer.screen.drug_design.cant_order.body');
                    return;
                }

                self.drugService.getDrugInfo(self.selectedScaffold().configurationString())
                    .then(function(info) {
                        self.selectedScaffold().drugInfo = info;

                        self.selectedScaffold().drugInfo.passes = self.drugService.getDrugPassages(info.logD);

                        alert('TODO: switch back to tube!');
                        var drugTube = ContainerFactory.tube().add(self.selectedScaffold().clone(), true);
                        /*var drugTube = ContainerFactory.micro().add(self.selectedScaffold().clone(), true);*/
                        self.gameState.inventory.add(drugTube);

                        self.selectedScaffold(self.getEmptyScaffold());

                        self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_DRUG, drugTube);
                    });
            };
        }
    });

    return DesignDrug;
});
