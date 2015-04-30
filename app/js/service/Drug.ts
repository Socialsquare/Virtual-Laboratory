import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

import ScaffoldModel = require('model/Scaffold');
import SidegroupModel = require('model/Sidegroup');
import drugsData = require('json!../../data/drugs.json');


class Drug {

    static scaffolds = _.map(drugsData.scaffolds, (values) => new ScaffoldModel(values));

    static sidegroups = _.map(drugsData.sidegroups, (values) => new SidegroupModel(values));

    static getDrugInfo(drugConfig: string) {

        var promise = $.Deferred();

        var testPath4 = 'data/drugs-data/' + drugConfig + '.json';
        var test4 = $.getJSON(testPath4).done((data) => {
            promise.resolve({
                weight: data.weight + 'g/mol',
                pKa: data.pka,
                logD: data.logD,
                logP: data.logP
            });
        });

        return promise;
    }

    static getScaffold(name: string) {
        var raw = _.find(drugsData.scaffolds, (obj) => {
            return obj.name === name;
        });

        return new ScaffoldModel(raw);
    }

    // TODO: properties

    //Given LogD, it can be determined where in the body the drug can go
    static getDrugPassages(logD: number) {
        var values = {};
        //Jannick also proposed > 3, but said 'start with 4'
        values.canPassSkin = logD >= 4;
        values.canPassBBB = logD >= 2 && logD <= 3;
        values.canPassBlood = logD <= 5;
        values.canPassIntestine = logD >= 1;

        return values;
    }
}

export = Drug;
