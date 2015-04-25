var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'knockout', 'controller/Router', 'service/Help', 'model/Popup'], function (require, exports, ko, router, helpService, PopupModel) {
    var Help = (function (_super) {
        __extends(Help, _super);
        function Help(popupController) {
            _super.call(this, 'popup-instruments', this, popupController);
            this.entries = helpService.getHelpEntries();
            this.selectedEntry = ko.observable(this.entries[0]);
        }
        Help.prototype.selectEntry = function (entry) {
            this.selectedEntry(entry);
        };
        Help.prototype.goToArea = function () {
            var entry = this.selectedEntry();
            if (entry.route) {
                router.navigate(entry.route);
                this.hide();
            }
        };
        return Help;
    })(PopupModel);
    return Help;
});
