import _ = require('lodash');
import Utils = require('utils/utils');

class DataHelper {

    static isObject(someVal) {
        if (someVal === null) return false;
        return ( (typeof someVal === 'function') || (typeof someVal === 'object') );
    }

    static toCSV(data: number[][], headers: string[]) {
        var dataRows = _.map(data, (points) => {
            return _.map(points, (p: any) => {
                if (_.isNumber(p)) {
                    return p.toFixed(2).toString();
                } else if (p instanceof Date) {
                    const mSec = (p.getMilliseconds() / 100).toFixed(0);
                    return p.toLocaleTimeString('da').replace(/\./g, ':') + '.' + mSec;
                } else if (p) {
                    return p;
                } else {
                    return 'unknown';
                }
            }).join('; ');
        });

        return headers.join('; ') + '\n' + dataRows.join('\n');
    }
}

export = DataHelper;
