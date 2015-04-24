define([
    'lodash',
    'jquery',
    'service/Base',
    'model/HelpEntry',
    'json!datadir/help.json'
], function (_, $, BaseService, HelpEntry, helpData) {
    var HelpService = BaseService.extend({
        getHelpEntries: function () {
            return _.map(helpData, function (entry) {
                return new HelpEntry(entry);
            });
        },
        //getHelpEntries: _.map(helpData, HelpEntry).bind(null)
    });

    return new HelpService();
});
