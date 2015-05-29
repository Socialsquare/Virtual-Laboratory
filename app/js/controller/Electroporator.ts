import ko = require('knockout');

import popupController = require('controller/Popup');

import SimpleContainerController = require('controller/SimpleContainer');

import ElectroporatorModel = require('model/Electroporator');

import ContainerType = require('model/type/Container');

class Electroporator extends SimpleContainerController<ElectroporatorModel> {

    constructor(electroporator: ElectroporatorModel) {
        super(electroporator);

        ko.rebind(this);
    }

    handleContainerDrop(item) {
        //TODO: test
        if (item.type() === ContainerType.PIPETTE) {
            if (!item.hasTip()) {
                popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');
            } else if (this.simpleContainer.isEmpty()) {
                // 1) hvis elektro er tom --> tilføj all the things
                item.emptyPipetteInto(this.simpleContainer);
                popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);
            } else if (!this.simpleContainer.isEmpty() && item.getTip().isEmpty()){
                // 2) hvis elektro har contents && pipette er tom --> sug alt

                // Check for contamination
                if (item.getTip().contaminatedBy() === null || item.getTip().contaminatedBy() === this.simpleContainer) {
                    popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                    item.fillPipette(this.simpleContainer);
                } else {
                    popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                }

            } else if (!this.simpleContainer.isEmpty() && !item.getTip().isEmpty()) {
                // 3) hvis elektro har contents && pipette har contents --> spørg: Vil du tømme elektro og tilføje?
                popupController.confirm('worktable1.electroporator_refill.header', 'worktable1.electroporator_refill.body')
                    .then(() => {
                        this.simpleContainer.clearContents();
                        item.emptyPipetteInto(this.simpleContainer);
                        popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                    });
            }
        }
    }
}

export = Electroporator;
