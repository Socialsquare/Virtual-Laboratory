import ko = require('knockout');
import postbox = require('knockout.postbox');

class GlucoseBag {

    public status: KnockoutObservable<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;

    constructor() {
        this.status = ko.observable(false);
        this.glucoseInfusionRate = ko.observable(0).publishOn("glucoseBagGirValueTopic");  

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
    }
    
    public deactivate(){
        this.status(false);
        this.glucoseInfusionRate(0);
    }
    
}

export = GlucoseBag;
