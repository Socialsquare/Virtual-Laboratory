import $ = require('jquery');
import ko = require('knockout');
import localizationService = require('service/Localization');

ko.bindingHandlers.i18n = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        let key = ko.unwrap(valueAccessor());
        let parts = '';
        let attr = '';

        // Check whether we are dealing with attributes
        if (key.indexOf !== undefined && key.indexOf('[') === 0) {
            parts = key.split(']');
            key = parts[1];
            attr = parts[0].substr(1, parts[0].length - 1);
        }

        var translated = !key ? '' : localizationService.text(key);

        if (attr === '') {
            $(element).text(translated);
        } else {
            $(element).attr(attr, translated);
        }
    }
};
