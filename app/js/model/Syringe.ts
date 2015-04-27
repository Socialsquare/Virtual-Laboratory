import ko = require('knockout');
import _ = require('lodash');
import utils = require('utils/utils');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Syringe extends SimpleContainerModel {

    constructor() {
        super(ContainerType.SYRINGE, Math.pow(10,13));
    }

    public fillSyringe = (container) => {
        // 1st modify the syringe
        /*var cloned_liqs = utils.klone(container.liquids);*/
        var cloned_liqs = _.invoke(container.liquids(), 'clone');
        /*var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);*/
        var modified_liqs = utils.biology.dilute(50, cloned_liqs);
        this.addAll(modified_liqs);

        // 2nd modify the container
        modified_liqs = utils.biology.dilute(50/49, container.liquids());
        container.clearContents();
        container.addAll(modified_liqs);
    }

    public emptySyringeInto = (container) => {
        var cloned_liqs = _.invoke(this.liquids(), 'clone');
        container.addAll(cloned_liqs);
        this.clearContents();
    }
}

export = Syringe;
