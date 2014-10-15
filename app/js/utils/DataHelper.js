define([
    'lodash'
], function (_) {
    return {
        toCSV: function (data, headers) {
            return _.reduce(data, function (data, point) {
                point = _.map(point, function(num){return num.toFixed(2);});
                return data + '\n' + point.join('\t');
            }, headers.join('\t'));
        }
    };
});
