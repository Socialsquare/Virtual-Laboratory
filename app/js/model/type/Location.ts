import ev = require('enumvalue');

enum Location {
    CHEMICAL = ev.next(), // "LocationType.CHEMICAL",
    COMPUTER = ev.next(), // "LocationType.COMPUTER",
    FERMENTOR = ev.next(), // "LocationType.FERMENTOR",
    FERMENTORSCREEN = ev.next(), // "LocationType.FERMENTORSCREEN",
    FUMEHOOD = ev.next(), // "LocationType.FUMEHOOD",
    INCUBATOR = ev.next(), // "LocationType.INCUBATOR",
    LOADING = ev.next(), // "LocationType.LOADING",
    MOUSE = ev.next(), // "LocationType.MOUSE",
    OVERVIEW = ev.next(), // "LocationType.OVERVIEW",
    SPECTROPM = ev.next(), // "LocationType.SPECTROPM",
    SPECTROPMSCREEN = ev.next(), // "LocationType.SPECTROPMSCREEN",
    UVROOM = ev.next(), // "LocationType.UVROOM",
    WASHING = ev.next(), // "LocationType.WASHING",
    WORKTABLE1 = ev.next(), // "LocationType.WORKTABLE1",
    WORKTABLE2 = ev.next(), // "LocationType.WORKTABLE2",
    INVENTORY = ev.next(), // "LocationType.INVENTORY"
}

export = Location;
