define([
    'lodash'
], function (_) {
    return {
        toCSV: function (data, headerX, headerY) {
            return _.reduce(data, function (data, point) {
                return data + '\n' + point[0] + ',' + point[1];
            }, headerX + ',' + headerY);
        }
    };
});
