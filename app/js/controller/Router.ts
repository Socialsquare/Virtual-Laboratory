import $ = require('jquery');
import ko = require('knockout');

class Router {

    public currentRoute: KnockoutObservable<string>;
    public viewHistory: KnockoutObservableArray<string>;
    public hasBack: KnockoutComputed<boolean>;

    constructor() {
        this.currentRoute = ko.observable(null);

        this.viewHistory = ko.observableArray([]);

        this.hasBack = ko.computed(() => {
            return !this.viewHistory.isEmpty();
        });
    }

    public navigate = (name) => {
        if (!!this.currentRoute()
            // ignore loading screen from history
            && this.currentRoute() !== 'loading'
            // ignore changing to the same route
            && this.currentRoute() !== name)
            this.viewHistory.push(this.currentRoute());

        this.currentRoute(name);
    }

    public back = () => {
        var view = this.viewHistory.pop();

        if (!view)
            return;

        this.currentRoute(view);
    }
}

export = new Router();
