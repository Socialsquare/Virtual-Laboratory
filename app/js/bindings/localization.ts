import $ = require('jquery');
import ko = require('knockout');
import localizationService = require('service/Localization');

ko.bindingHandlers.i18n = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var id = ko.unwrap(valueAccessor());
        var translated = !id ? '' : localizationService.text(id);
        $(element).text(translated);
    }
};
