define([
    'lodash'
], function (_) {
    return {
        toCSV: function (data, headers) {
            return _.reduce(data, function (data, point) {
                return data + '\n' + point.join('\t');
            }, headers.join('\t'));
        }
    };
});
