// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-focus', [])
        .directive('samtecFocus', samtecFocus);
    
    samtecFocus.$inject = [ '$timeout'];
    
    function samtecFocus($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                attrs.$observe('samtecFocus', function (iVal) {

                    if (iVal === 'true') {
                        $timeout(function () {
                            $element[0].focus();
                        }, 10);
                    }
                });

                if (attrs.autoSelectText !== undefined && (($element.is("input") && $element.prop("type") === "text") || $element.is("textarea"))) {
                    $element.bind('focus', function (e) {
                        this.select();
                    });
                }
            }
        };
    }
})();