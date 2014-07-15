define([
    'jquery',
    'knockout',
    'lodash',
    'service/Localization'
], function ($, ko, _, localizationService) {

    ko.bindingHandlers.i18n = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var id = valueAccessor();
            $(element).text(localizationService.text(id));
        }
    };
});
