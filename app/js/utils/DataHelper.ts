import _ = require('lodash');

class DataHelper {

    static toCSV(data: number[][], headers: string[]) {
        var dataRows = _.map(data, (points) => {
            return _.map(points, (p) => {
                if (p && !isNaN(p)) {
                    return p.toFixed(2);
                } else if (p){
                    return p;
                } else {
                    return '';
                }
            }).join('\t');
        });

        return headers.join('\t') + '\n' + dataRows.join('\n');
    }
}

export = DataHelper;
