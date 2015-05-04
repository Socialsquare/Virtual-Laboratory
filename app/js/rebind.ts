import ko = require('knockout');

ko.rebind = function(obj : any) {
    var prototype = <Object>obj.constructor.prototype;
    for (var name in prototype) {
        if (!obj.hasOwnProperty(name)
                && typeof prototype[name] === "function") {
            var method = <Function>prototype[name];
            obj[name] = method.bind(obj);
        }
    }
}
