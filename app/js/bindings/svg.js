define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {

    ko.bindingHandlers.scaffold = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var path = ko.unwrap(valueAccessor());
            console.log(path);
            $.get(path, function (data) {
                var svgNode = $("svg", data);
	            var docNode = document.adoptNode(svgNode[0]);

                var origin = $(docNode).find('text[fill="rgb(255,0,0)"]')
                        .hide()
                        .filter(function (idx, node) {
                            return $(node).text() === '1';
                        })
                        .first();

                $(element)
                    .offset({
                        left: 600 - parseInt(origin.attr('x'), 10),
                        top: 200 - parseInt(origin.attr('y'), 10)
                    })
                    .html(docNode);
            });
        }
    };

    ko.bindingHandlers.svg = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var path = ko.unwrap(valueAccessor());
            $.get(path, function (data) {
                var svgNode = $("svg", data);
	            var docNode = document.adoptNode(svgNode[0]);
                $(element).html(docNode);
            });
        }
    };
});
