define([
    'knockout',
    'base',
    'model/InventoryItem',
    'model/Container'
], function (ko, Base, InventoryItem, Container) {
    var ItemFactory = Base.extend({
        createTube: function () {
            var data = {
                name: 'Reagensglas',
				type: 'testtube',
				klass: 'testtube',
				icon: 'img/icon_cup_tube.png',
				content: new Container()
			};

            return new InventoryItem(data);
        }
    });

    return new ItemFactory();
});
