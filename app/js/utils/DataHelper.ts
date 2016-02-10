import _ = require('lodash');
import Utils = require('utils/utils');

class DataHelper {
    
    static isObject(someVal) {
        if (someVal === null) return false;
        return ( (typeof someVal === 'function') || (typeof someVal === 'object') );
    }

    static toCSV(data: number[][], headers: string[]) {
        var dataRows = _.map(data, (points) => {
            return _.map(points, (p) => {
                if (_.isNumber(p)) {
                    return p.toFixed(2).toString();
                } else if (DataHelper.isObject(p) && (typeof p.getMonth === 'function')) {
                    var dOptions = {year: '2-digit', month: '2-digit', day:'2-digit'};
                    var dateStr = p.toLocaleDateString('dk', dOptions);
                    var timeStr = p.toLocaleTimeString('dk');
                    return dateStr + '@' + timeStr;
                } else if (p) {
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
