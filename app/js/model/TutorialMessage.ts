class TutorialMessage {

    public title: string;
    public message: string;
    public x: number;
    public y: number;
    public arrowTop: boolean;
    public arrowLeft: boolean;
    public hideArrow: boolean;

    constructor(values: any) {
        this.title = values.title;
        this.message = values.message;
        this.x = values.x;
        this.y = values.y;
        this.arrowTop = values.arrowTop;
        this.arrowLeft = values.arrowLeft;
        this.hideArrow = values.hideArrow;
    }
}

export = TutorialMessage;
