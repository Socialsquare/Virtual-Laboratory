define([
    'knockout',
    'lodash'
], function (ko, _) {
    ko.observableArray.fn.setAt = function(index, value) {
        this.valueWillMutate();
        this()[index] = value;
        this.valueHasMutated();
    };

    ko.observableArray.fn.isEmpty = function() {
        return _.isEmpty(this());
    };
});
