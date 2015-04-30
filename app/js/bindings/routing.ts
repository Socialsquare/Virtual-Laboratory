import $ = require('jquery');
import ko = require('knockout');
import router = require('controller/Router');


ko.bindingHandlers.route = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var routeName = valueAccessor();
        $(element).click(function () {
            router.navigate(routeName);
        });
    }
};
