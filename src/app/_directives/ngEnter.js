// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('ngEnter', [])
        .directive('ngEnter', ngEnter);

    ngEnter.$inject = ['$timeout'];

    function ngEnter($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                $element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        $scope.$apply(function () {
                            $scope.$eval(attrs.ngEnter, { 'event': event });
                        });

                        event.preventDefault();
                    }
                });
            }
        };
    }
})();