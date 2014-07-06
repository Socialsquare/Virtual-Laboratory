define([
    'jquery'
], function ($) {
    var BaseService = Base.extend({
        baseUrl: '/api/',

        get: function (url) {
            return $.ajax({
                url: this.baseUrl + url,
                dataType: 'json',
                type: 'GET'
            });
        }
    });

    return BaseService;
});
