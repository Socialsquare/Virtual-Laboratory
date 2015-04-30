import ko = require('knockout');
import _ = require('lodash');

ko.observableArray.fn.setAt = function(index, value) {
    this.valueWillMutate();
    this()[index] = value;
    this.valueHasMutated();
};

ko.observableArray.fn.isEmpty = function() {
    return _.isEmpty(this());
};

ko.observableArray.fn.pushAll = function(values) {
    return ko.utils.arrayPushAll(this, values);
};

// toggle bools
ko.observable.fn.toggle = function() {
    return this(!this());
};
