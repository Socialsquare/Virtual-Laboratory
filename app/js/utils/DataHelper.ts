import _ = require('lodash');

class DataHelper {

    static toCSV(data: number[][], headers: string[]) {
        var dataRows = _.map(data, (points) => {
            return _.map(points, (p) => {
                if (p == null) {
                    return '';
                } else {
                    return p.toFixed(2);
                }
            }).join('\t');
        });

        return headers.join('\t') + '\n' + dataRows.join('\n');
    }
}

export = DataHelper;
