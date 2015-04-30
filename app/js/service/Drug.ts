import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

import ScaffoldModel = require('model/Scaffold');
import SidegroupModel = require('model/Sidegroup');
import DrugPassagesModel = require('model/DrugPassages');
import DrugInfoModel = require('model/DrugInfo');

import drugsData = require('json!datadir/drugs.json');

class Drug {

    static scaffolds = _.map(drugsData.scaffolds, (values) => new ScaffoldModel(values));

    static sidegroups = _.map(drugsData.sidegroups, (values) => new SidegroupModel(values));

    static getDrugInfo(drugConfig: string) {

        var promise = $.Deferred();

        var testPath4 = 'data/drugs-data/' + drugConfig + '.json';
        var test4 = $.getJSON(testPath4).done((data: any) => {
            var info = new DrugInfoModel(data);
            info.passes = Drug.getDrugPassages(info.logD);
            promise.resolve(info);
        });

        return promise;
    }

    static getScaffold(name: string) {
        return _.find(Drug.scaffolds, (obj) => obj.name === name);
    }

    // TODO: properties

    //Given LogD, it can be determined where in the body the drug can go
    static getDrugPassages(logD: number) {
        return new DrugPassagesModel(logD);
    }
}

export = Drug;
