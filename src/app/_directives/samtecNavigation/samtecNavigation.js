// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-navigation', [])
        .directive('samtecNavigation', samtecNavigation);

    samtecNavigation.$inject = ['$location', 'cache', '$timeout'];

    function samtecNavigation($location, cache, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'app/_directives/samtecNavigation/samtecNavigation.html',
            scope: {
                items: '=samtecNavigationItems'
            },
            link: function (scope, element, attrs) {
                scope.search = cache.Search;
                scope.showMenu = true;

                scope.isSelected = function (item) {
                    if (item.route.indexOf('?') > -1) {  // If it has parameters
                        return item.route === $location.url();
                    }
                    else {
                        return item.route === $location.path();
                    }
                };

                scope.getUrlParams = function (useUrlParams) {
                    if (useUrlParams === null || useUrlParams === false) {
                        return '';
                    }

                    var startDate = moment(scope.search.StartDate).isValid() ? moment(scope.search.StartDate).format('MM-DD-YYYY') : '';
                    var endDate = moment(scope.search.EndDate).isValid() ? moment(scope.search.EndDate).format('MM-DD-YYYY') : '';

                    return '?searchTerm=' + scope.search.SearchTerm + '&startDate=' + startDate + '&endDate=' + endDate;
                };
            }
        };
    }
})();