import DrugPassagesModel = require('model/DrugPassages');

class DrugInfo {

    public passes: DrugPassagesModel;

    public weight: string;
    public pKa: number;
    public logD: number;
    public logP: number;

    constructor(values: any) {
        this.weight = values.weight + 'g/mol';
        this.pKa = values.pka;
        this.logD = values.logD;
        this.logP = values.logP;
    }
}

export = DrugInfo;
