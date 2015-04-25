import ko = require('knockout');
import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

class Washing extends BaseViewController {

    constructor() {
        super('washing');

        this.washing = this.gameState.washing;
        this.status = ko.observable(false);
        this.result = ko.observable(0);

        this.tubeRackController = new CompositeContainerController(this.washing.tubeRack);
        this.tubeRackController.addDropGuard(this.smallPoxGuard);
    }

    public activate = () => {
        if (!this.washing.agent())
            this.popupController.message('washing.detergent_required.header', 'washing.detergent_required.body');
        else
            this.status.toggle();
    }

    public reset = () => {
        if (!this.result()) return;

        this.result(0);
        this.status(false);
        this.washing.washingTank.clearContents();
    }

    public handleWashingDrop = (item) => {
        if (this.status()) return false;

        if (item.isEmpty()) {
            this.popupController.message('washing.empty_tube.header', 'washing.empty_tube.body');
            return false;
        }

        this.washing.washingTank.addAll(item.liquids());
        this.status(true);


        //TODO: i18n localization if necessary
        var options = [
            {key: '1 mg/L', concentration: 1.0},
            {key: '3 mg/L', concentration: 3.0},
            {key: '10 mg/L', concentration: 10.0},
            {key: '30 mg/L', concentration: 30.0},
            {key: '100 mg/L', concentration: 100.0},
            {key: '300 mg/L', concentration: 300.0},
            {key: '1000 mg/L', concentration: 1000.0}
        ];

        this.popupController.select('washing.concentration', 'washing.concentration.choose', options)
            .then((selectedObject) => {
                var res = this.washing.action(selectedObject.concentration);

                this.result(res.result);
                this.status(false);

                if (res.feedback) this.popupController.notify('common.result', res.feedback);

                this.experimentController.triggerActivation(this.ActivationType.WASHING, this.washing,
                                                            { concentration: selectedObject.concentration });
            });
    }
}

export = Washing;
