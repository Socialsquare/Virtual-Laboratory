import ko = require('knockout');

class Router {

    public currentRoute: KnockoutObservable<string>;
    public viewHistory: KnockoutObservableArray<string>;
    public hasBack: KnockoutComputed<boolean>;
    public isOverview: KnockoutComputed<boolean>;

    constructor() {
        this.currentRoute = ko.observable(null);

        this.viewHistory = ko.observableArray([]);

        this.hasBack = ko.pureComputed(() => {
            return !this.viewHistory.isEmpty();
        });

        this.isOverview = ko.pureComputed(() => {
            return this.currentRoute() === 'overview';
        });

        ko.rebind(this);
    }

    navigate(name: string) {
        if (!!this.currentRoute()
            // ignore changing to the same route
            && this.currentRoute() !== name)
            this.viewHistory.push(this.currentRoute());

        this.currentRoute(name);
    }

    back() {
        var view = this.viewHistory.pop();

        if (!view)
            return;

        this.currentRoute(view);
    }

    update() {}
}

export = new Router();
