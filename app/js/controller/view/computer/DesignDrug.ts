import ko = require('knockout');
import $ = require('jquery');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');

import drugService = require('service/Drug');

import ContainerFactory = require('factory/Container');

import ActivationType = require('model/type/Activation');

import gameState = require('model/GameState');
import SidegroupModel = require('model/Sidegroup');
import SidegroupSlotModel = require('model/SidegroupSlot');
import ScaffoldModel = require('model/Scaffold');

import utils = require('utils/utils');


class DesignDrug extends BaseComputer {

    public sidegroups: SidegroupModel[];
    public selectedScaffold: KnockoutObservable<ScaffoldModel>;

    constructor() {
        super('computer-design-drug', 'computer.screen.drug');

        this.sidegroups = drugService.sidegroups;

        this.selectedScaffold = ko.observable(this.getEmptyScaffold());
    }

    public getEmptyScaffold = () => {
        return drugService.getScaffold("1");
    }


    public showSidegroupInfo = (sidegroup: SidegroupModel) => {
        var popupInfo = {pKa: sidegroup.info.pKa, weight: sidegroup.info.weight};
        popupController.kvInfo(popupInfo);
    }

    public handleDrop = (slot: SidegroupSlotModel, group: SidegroupModel) => {
        slot.sidegroup(group);
    }

    public slotDraggingHelper = (slot: SidegroupSlotModel) => {
        var dragger = $('<div>');

        $.get(slot.sidegroup().file(), (data) => {
            var svgNode = $("svg", data);
	        var docNode = document.adoptNode(svgNode[0]);
            dragger.html(docNode);
        });

        return dragger;
    }

    public getInfo = () => {
        drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                popupController.kvInfo(info);
            });
    }

    public getHelp = () => {
        popupController.message('computer.screen.drug_design.help.header', 'computer.screen.drug_design.help.body');
    }

    public order = () => {
        if (_.contains(this.selectedScaffold().configurationString(), 'R')) {
            popupController.message('computer.screen.drug_design.cant_order.header', 'computer.screen.drug_design.cant_order.body');
            return;
        }

        drugService.getDrugInfo(this.selectedScaffold().configurationString())
            .then((info) => {
                this.selectedScaffold().drugInfo = info;

                this.selectedScaffold().drugInfo.passes = drugService.getDrugPassages(info.logD);

                var drugTube = ContainerFactory.tube().add(this.selectedScaffold().clone(), true);

                gameState.inventory.add(drugTube);

                this.selectedScaffold(this.getEmptyScaffold());

                this.experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_DRUG, drugTube);
            });
    }
}

export = DesignDrug;
