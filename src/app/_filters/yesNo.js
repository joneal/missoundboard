(function () {
    'use strict';

    angular
        .module('yes-no', [])
        .filter('yesNo', YesNoFilter);

    YesNoFilter.$inject = [ ];

    function YesNoFilter() {
        return function (input) {
            return input ? 'Yes' : 'No';
        };
    }
})();