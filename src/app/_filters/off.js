(function () {
    'use strict';

    angular
        .module('off-filter', [])
        .filter('off', OffFilter);

    OffFilter.$inject = [ ];

    function OffFilter() {
        return function (input) {
            return (input === 0) ? 'OFF' : input;
        };
    }
})();