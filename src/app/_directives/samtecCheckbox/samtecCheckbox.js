// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-checkbox', [])
        .directive('samtecCheckbox', samtecCheckbox);
    
    samtecCheckbox.$inject = [];
    
    function samtecCheckbox() {
        return {
            scope: {},
            require: "ngModel",
            restrict: "E",
            replace: true,
            templateUrl: 'app/_directives/samtecCheckbox/samtecCheckbox.html',
            link: function (scope, elem, attrs, modelCtrl) {
                // Check if name attribute is set and if so add it to the DOM element
                if (scope.name !== undefined) {
                    elem.name = scope.name;
                }

                var trueValue = true;
                var falseValue = false;

                // Update element when model changes
                scope.$watch(function () {
                    if (modelCtrl.$modelValue === trueValue || modelCtrl.$modelValue === true) {
                        modelCtrl.$setViewValue(trueValue);
                    } else {
                        modelCtrl.$setViewValue(falseValue);
                    }
                    return modelCtrl.$modelValue;
                }, function (newVal, oldVal) {
                    scope.checked = modelCtrl.$modelValue === trueValue;
                }, true);

                // On click swap value and trigger onChange function
                elem.bind("click", function () {
                    scope.$apply(function () {
                        if (modelCtrl.$modelValue === falseValue) {
                            modelCtrl.$setViewValue(trueValue);
                        } else {
                            modelCtrl.$setViewValue(falseValue);
                        }
                    });
                });
            }
        };
    }
})();