class DrugPassages {

    public canPassSkin: boolean;
    public canPassBBB: boolean;
    public canPassBlood: boolean;
    public canPassIntestine: boolean;

    constructor(logD: number) {
        //Jannick also proposed > 3, but said 'start with 4'
        this.canPassSkin = logD >= 4;
        this.canPassBBB = logD >= 2 && logD <= 3;
        this.canPassBlood = logD <= 5;
        this.canPassIntestine = logD >= 1;
    }
}

export = DrugPassages;
