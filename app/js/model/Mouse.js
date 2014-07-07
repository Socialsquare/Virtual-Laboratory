define([
	'knockout',
    'base',
	'lodash'
],
function(ko, Base, _) {
    var MouseModel = Base.extend({
		id: ko.observable(null),
		type: ko.observable(null),
		alive: ko.observable(true),
		cut: ko.observable(false),
		spleen: ko.observable(true)
    });

    return MouseModel;

    // TODO: what was this for?
	// var HEALTHY = 1;
	// var DIABETES = 2;
	// var DEAD = 3;
});
