// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-button-save-effect', [])
        .directive('samtecButtonSaveEffect', samtecButtonSaveEffect);
    
    samtecButtonSaveEffect.$inject = ['$timeout'];
    
    function samtecButtonSaveEffect($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                attrs.$observe('samtecButtonSaveEffect', function (iVal) {
                    if (iVal === 'true') {
                        $(element[0]).height($(element[0]).height() + 'px');
                        $(element[0]).width($(element[0]).width() + 'px');

                        $(element[0]).addClass('saved');

                        var originalHtml = $(element[0]).html();
                        var saveHtml = '<i class="fa fa-check"></i>';

                        $(element[0]).html(saveHtml);

                        $timeout(function () {
                            $(element[0]).find('i.fa').addClass('saved');
                        }, 10);

                        $timeout(function () {
                            $(element[0]).removeClass('saved');
                            $(element[0]).html(originalHtml);
                        }, 2000);
                    }
                });
            }
        };
    }
})();