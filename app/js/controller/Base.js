define([
    'base'
], function (Base) {
    var BaseController = Base.extend({
        constructor: function (id, name) {
            this.id = id;
            this.name = name;
        },

        greet: function () {
            alert('hello i am ' + this.name);
        }
    });

    return BaseController;
});
