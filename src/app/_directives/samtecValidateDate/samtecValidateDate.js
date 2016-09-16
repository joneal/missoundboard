// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-validate-date', [])
        .directive('samtecValidateDate', samtecValidateDate);

    samtecValidateDate.$inject = ['$compile'];

    function samtecValidateDate($compile) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {
                function validate(value) {
                    if (value !== undefined && value !== null) {
                        ngModel.$setValidity('invalidDate', true);
                        if (value instanceof Date) {
                            var d = Date.parse(value);
                            
                            if (isNaN(d)) {
                                ngModel.$setValidity('invalidDate', false);
                            }
                        } else {
                            var myPattern = new RegExp(/^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(199\d|[2-9]\d{3})$/);
                            if (value !== '' && !myPattern.test(value)) {
                                ngModel.$setValidity('invalidDate', false);
                            }
                        }
                    }
                }

                scope.$watch(function () {
                    return ngModel.$viewValue;
                }, validate);
            }
        };
    }

})();
