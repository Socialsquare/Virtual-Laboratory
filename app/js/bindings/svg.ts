import $ = require('jquery');
import ko = require('knockout');

ko.bindingHandlers.scaffold = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var scaffold = ko.unwrap(valueAccessor());
        var path = scaffold.file();
        var offset = scaffold.offset;

        $.get(path, (data) => {
            var svgNode = $('svg', data);
	        var docNode = document.adoptNode(svgNode[0]);
            var origin = $(docNode).find('text[fill="rgb(255,0,0)"]')
                .hide()
                .filter((idx, node) => $(node).text() === '1')
                .first();

            $(element)
                .css({
                    left: offset.x - parseInt(origin.attr('x'), 10) + 'px',
                    top: offset.y - parseInt(origin.attr('y'), 10) + 'px'
                })
                .html(<any>docNode);
        });
    }
};

ko.bindingHandlers.svg = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var path = ko.unwrap(valueAccessor());

        $.get(path, function (data) {
            var svgNode = $('svg', data);
	        var docNode = document.adoptNode(svgNode[0]);
            $(element).html(<any>docNode);
        });
    }
};
