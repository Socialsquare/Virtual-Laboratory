import ko = require('knockout');
import i18n = require('service/Localization');
import TextHelper = require('utils/TextHelper');
import SimpleContainer = require('model/SimpleContainer');

// Helper
var transformObject = function (obj) {
    var properties = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            properties.push({ key: key, value: obj[key] });
        }
    }
    return properties;
};

ko.bindingHandlers.foreachKV = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
        properties = transformObject(value);
        ko.applyBindingsToNode(element, { foreach: properties });
        return { controlsDescendantBindings: true };
    }
};


interface ITooltTipArguments {
    item?: SimpleContainer,
    text?: string
}

const showTooltipTimeout = null
const showTooltip = (content: string) => {
    clearTimeout(showTooltipTimeout)
    const $tooltip = $('#tooltip')
    $tooltip.html(content)

    showTooltipTimeout = setTimeout(() => {
        showTooltipTimeout = false
        $tooltip.show()
    }, 500)
}

const hideTooltip = () => {
    clearTimeout(showTooltipTimeout)
    const $tooltip = $('#tooltip')
    $tooltip.hide()
}

const moveTooltip = (e) => {
    const $tooltip = $('#tooltip')
    const top = e.clientY + 20
    const left = e.clientX + 20
    $tooltip.css({
        top: `${top}px`,
        left: `${left}px`,
    })
}

$(() => {
    const $tooltip = $('<div id="tooltip">')
    $tooltip.hide()
    $('body').append($tooltip)

    $(document).mousemove((e) => {
        if ($tooltip.is(':visible') || showTooltipTimeout !== null) {
            moveTooltip(e)
        }
    })
})

ko.bindingHandlers.tooltip = {
    update: function (element, valueAccessor) {
        console.log('tooltip setup!')
        const { item, text }: ITooltTipArguments = valueAccessor()

        $(element)
        .mouseenter(event => {
            let content = ''

            if (text) {
                content += text
            }

            if (item) {
                content += `<strong>${i18n.text(TextHelper.prettyName(item))}</strong>`

                if (item.label()) {
                    content += '<p>'
                    content += `<strong>${i18n.text('popup.details.content')}</strong><br />`
                    content += item.label()
                    content += '</p>'
                }

                if (item.extraInfo()) {
                    content += '<p>'
                    content += `<strong>${i18n.text('popup.details.extra_info')}</strong><br />`
                    content += item.extraInfo()
                    content += '</p>'
                }

                if (item.note()) {
                    content += '<p>'
                    content += `<strong>${i18n.text('popup.details.notes')}</strong><br />`
                    content += item.note()
                    content += '</p>'
                }
            }

            if (content) {
                showTooltip(content)
            }
        })
        .mouseleave(hideTooltip)
    }
}