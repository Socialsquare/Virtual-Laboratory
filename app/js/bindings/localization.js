define([
    'jquery',
    'knockout',
    'lodash',
    'service/Localization'
], function ($, ko, _, localizationService) {

    ko.bindingHandlers.i18n = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var id = ko.unwrap(valueAccessor());
            var translated = !id ? '' : localizationService.text(id);
            $(element).text(translated);
        }
    };
});
