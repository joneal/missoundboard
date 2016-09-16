// Copyright (C) 1976-2015, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-validate-email', [])
        .directive('samtecValidateEmail', function () {
        var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        function validateAll(ctrl, validatorName, value) {
            var validity = ctrl.$isEmpty(value) || value.split(/[\s,;]+/).every(
                function (email) {
                    return EMAIL_REGEXP.test(email.trim());
                }
            );

            ctrl.$setValidity(validatorName, validity);
            return validity ? value : undefined;
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, elem, attrs, modelCtrl) {
                function multipleEmailsValidator(value) {
                    return validateAll(modelCtrl, 'samtecValidateEmail', value);
                }

                modelCtrl.$formatters.push(multipleEmailsValidator);
                modelCtrl.$parsers.push(multipleEmailsValidator);
            }
        };
    });

})();
