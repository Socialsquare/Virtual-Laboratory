import ko = require('knockout');
import $ = require('jquery');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import drugService = require('service/Drug');

import ContainerFactory = require('factory/Container');

import ActivationType = require('model/type/Activation');

import gameState = require('model/GameState');
import SidegroupModel = require('model/Sidegroup');
import SidegroupSlotModel = require('model/SidegroupSlot');
import ScaffoldModel = require('model/Scaffold');

class DesignDrug extends BaseComputer {

    public sidegroups: SidegroupModel[];
    public selectedScaffold: KnockoutObservable<ScaffoldModel>;

    constructor() {
        super('computer-design-drug', 'computer.drug');

        this.sidegroups = drugService.sidegroups;

        this.selectedScaffold = ko.observable(this.getEmptyScaffold());

        ko.rebind(this);
    }

    getEmptyScaffold() {
        return drugService.getScaffold('1');
    }


    showSidegroupInfo(sidegroup: SidegroupModel) {
        var popupInfo = {pKa: sidegroup.info.pKa, weight: sidegroup.info.weight};
        popupController.kvInfo(popupInfo);
    }

    handleDrop(slot: SidegroupSlotModel, group: SidegroupModel) {
        slot.sidegroup(group);
    }

    slotDraggingHelper(slot: SidegroupSlotModel) {
        var dragger = $('<div class="drug-draggable">');

        $.get(slot.sidegroup().file(), (data) => {
            var svgNode = $('svg', data);
            var docNode = document.adoptNode(svgNode[0]);
            dragger.html(<any>docNode);
        });

        return dragger;
    }

    getInfo() {
        drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                popupController.kvInfo(info);
            });
    }

    getHelp() {
        popupController.message('computer.drug_design.help.header', 'computer.drug_design.help.body');
    }

    order() {
        if (_.contains(this.selectedScaffold().configurationString(), 'R')) {
            popupController.message('computer.drug_design.cant_order.header', 'computer.drug_design.cant_order.body');
            return;
        }

        drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                this.selectedScaffold().drugInfo = info;

                var drugTube = ContainerFactory.tube().add(this.selectedScaffold().clone(), true);

                gameState.inventory.add(drugTube);

                this.selectedScaffold(this.getEmptyScaffold());

                experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_DRUG, drugTube);
            });
    }
}

export = DesignDrug;
