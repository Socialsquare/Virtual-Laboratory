import ko = require('knockout');
import postbox = require('knockout.postbox');

class GlucoseBag {

    public status: KnockoutObservable<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;

    constructor() {
        this.status = ko.observable(false);
        this.glucoseInfusionRate = ko.observable(null).publishOn("glucoseBagGirValueTopic");  

        ko.rebind(this);
    }

    public statusToggle() {
        if (this.status()){
            this.deactivate();
        } else {
            this.activate();
        }
    }
    
    public activate() {
        this.status(true);
        this.glucoseInfusionRate(0);
    }
    
    public deactivate(){
        this.status(false);
        this.glucoseInfusionRate(null);
    }
}

export = GlucoseBag;
