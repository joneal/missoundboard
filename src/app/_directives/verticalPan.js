// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('vertical-pan', [])
        .directive('verticalPan', verticalPan);

    verticalPan.$inject = ['$timeout'];

    function verticalPan($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {

                $timeout(function () {

                    $element.css('overflow-y', 'hidden');
                    $element.css('overflow-x', 'hidden');
                    $element.css('height', '100%');

                    var elem = $element[0];

                    var hammerTime = new Hammer(elem);

                    hammerTime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

                    hammerTime.on('panup pandown tap press', function (ev) {

                        var newTopScroll = elem.scrollTop - ev.deltaY;

                        // Determine if it's out of top bounds
                        if (newTopScroll <= 0) {
                            newTopScroll = 0;
                        }

                        // Determine if is at the end of scroll
                        if (newTopScroll > elem.scrollHeight - elem.clientHeight) {
                            newTopScroll = elem.scrollHeight - elem.clientHeight;
                        }

                        elem.scrollTop = newTopScroll;
                    });
                });
            }
        };
    }
})();