define([
    'jquery',
    'base'
], function ($, Base) {
    var BaseService = Base.extend({
        get: function (url) {
            return $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET'
            });
        }
    });

    return BaseService;
});
