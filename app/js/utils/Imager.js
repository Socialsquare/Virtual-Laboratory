define([], function () {
    return {
        tubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? 'empty' : 'full';
            return 'img/worktable1_testtube_' + (position + 1) + '_' + state + '.png';
        }
    };
});
