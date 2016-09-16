// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-blocker', [])
        .directive('samtecBlocker', samtecBlocker);
    
    samtecBlocker.$inject = [];
    
    function samtecBlocker() {
        return {
            restrict: 'EA',
            templateUrl: 'app/_directives/samtecBlocker/samtecBlocker.html',
            transclude: true,
            scope: {
                samtecBlocker: '=samtecBlocker'
            },
            link: function (scope, element, attrs) {
                var receivedBlockerEvent = false;

                scope.showBlocker = function () {
                    if (!_.isUndefined(scope.samtecBlocker)) {
                        return scope.samtecBlocker;
                    }
                    else {
                        return receivedBlockerEvent;
                    }
                };

                scope.$on('blocker-request-event', function () {
                    receivedBlockerEvent = true;
                });

                scope.$on('blocker-response-event', function () {
                    receivedBlockerEvent = false;
                });

                scope.$on('blocker-error-event', function () {
                    receivedBlockerEvent = false;
                });
            }
        };
    }
})();