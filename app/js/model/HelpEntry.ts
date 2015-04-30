class HelpEntry {

    public title: string;
    public body: string;
    public image: string;
    public route: string;

    constructor(values: any) {
        this.title = values.title;
        this.body = values.body;
        this.image = values.image;
        this.route = values.route;
    }
}

export = HelpEntry;
