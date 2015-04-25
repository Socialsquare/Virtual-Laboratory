import ko = require('knockout');
import $ = require('jquery');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');

import drugService = require('service/Drug');

import ContainerFactory = require('factory/Container');

import gameState = require('model/GameState');

import utils = require('utils/utils');


class DesignDrug extends BaseComputer {

    constructor() {
        super('computer-design-drug', 'computer.screen.drug');

        this.drugService = drugService;
        this.sidegroups = drugService.sidegroups;
        this.popupController = popupController;

        this.selectedScaffold = ko.observable(this.getEmptyScaffold());
    }

    public getEmptyScaffold = () => {
        return this.drugService.getScaffold("1");
    }


    public showSidegroupInfo = (sidegroup) => {
        var popupInfo = {pKa: sidegroup.info.pKa, weight: sidegroup.info.weight};
        this.popupController.kvInfo(popupInfo);
    }

    public handleDrop = (slot, group) => {
        slot.sidegroup(group);
    }

    public slotDraggingHelper = (slot) => {
        var dragger = $('<div>');

        $.get(slot.sidegroup().file(), (data) => {
            var svgNode = $("svg", data);
	        var docNode = document.adoptNode(svgNode[0]);
            dragger.html(docNode);
        });

        return dragger;
    }

    public getInfo = () => {
        this.drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                this.popupController.kvInfo(info);
            });
    }

    public getHelp = () => {
        this.popupController.message('computer.screen.drug_design.help.header', 'computer.screen.drug_design.help.body');
    }

    public order = () => {
        if (_.contains(this.selectedScaffold().configurationString(), 'R')) {
            this.popupController.message('computer.screen.drug_design.cant_order.header', 'computer.screen.drug_design.cant_order.body');
            return;
        }

        this.drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                this.selectedScaffold().drugInfo = info;

                this.selectedScaffold().drugInfo.passes = this.drugService.getDrugPassages(info.logD);

                var drugTube = ContainerFactory.tube().add(this.selectedScaffold().clone(), true);

                this.gameState.inventory.add(drugTube);

                this.selectedScaffold(this.getEmptyScaffold());

                this.experimentController.triggerActivation(this.ActivationType.COMPUTER_ORDER_DRUG, drugTube);
            });
    }
}

export = DesignDrug;
