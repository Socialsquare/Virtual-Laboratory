define([
    'jquery',
    'knockout',
    'controller/Router'
], function ($, ko, router) {

    ko.bindingHandlers.route = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var routeName = valueAccessor();
            $(element).click(function () {
                router.navigate(routeName);
            });
        }
    };
});
