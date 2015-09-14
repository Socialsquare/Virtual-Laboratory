import ko = require('knockout');

import MouseModel = require('model/Mouse');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import GlucoseBagModel = require('model/GlucoseBag');

class MouseCage {

    public mouse: KnockoutObservable<MouseModel>;
    public hasMouse: KnockoutComputed<boolean>;
    public glucoseBag: GlucoseBagModel;

    constructor() {
        this.mouse = ko.observable(null);
        this.hasMouse = ko.pureComputed(():boolean =>{
            return <boolean><any>this.mouse();
        }).extend({ notify: 'always' });
        this.glucoseBag = new GlucoseBagModel();

        ko.rebind(this);
    }

    reset() {
        this.mouse(null);
    }
}

export = MouseCage;
