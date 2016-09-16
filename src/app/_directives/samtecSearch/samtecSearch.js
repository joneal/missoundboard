// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('samtec-search', [])
        .directive('samtecSearch', samtecSearch);

    samtecSearch.$inject = ['$location', '$rootScope', '$timeout'];

    function samtecSearch($location, $rootScope, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'app/_directives/samtecSearch/samtecSearch.html',
            scope: {
                placeholder: '@placeholder',
                searchTerm: '=samtecSearchTerm',
                startDate: '=samtecSearchStartDate',
                endDate: '=samtecSearchEndDate',
                maxDate: '=samtecSearchMaxDate',
                onSearch: '&samtecOnSearch',
                getTypeAheadEntries: '&samtecTypeAheadEntries',
                typeAheadMinLength: '=samtecTypeAheadMinLength',
                showCalendar: '=samtecShowCalendar'
            },
            link: function (scope, element, attrs) {
                scope.showDates = false;

                if (scope.showCalendar === null) {
                    scope.showCalendar = true;
                }

                scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 0,
                    showWeeks: false
                };

                scope.myTypeAheadEntries = function (searchTerm) {
                    if (!!scope.getTypeAheadEntries()) {
                        return scope.getTypeAheadEntries()(searchTerm);
                    }
                    else {
                        return [];
                    }
                };

                scope.today = function () {
                    scope.startDate = new Date();
                    scope.endDate = new Date();
                };

                scope.clear = function () {
                    scope.startDate = null;
                    scope.endDate = null;
                };

                scope.openStartDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.endDateOpened = false;
                    scope.startDateOpened = true;
                };

                scope.openEndDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.startDateOpened = false;
                    scope.endDateOpened = true;
                };

                scope.startDateChangedHandler = function () {
                    // if they chose a start date, automatically open the end date calendar
                    if (scope.startDateOpened) {
                        if (scope.endDate === null) {
                            scope.endDate = moment(scope.startDate).format('l');
                        }

                        scope.endDateOpened = true;
                    }
                };

                scope.keyDownHandler = function (event) {
                    event.stopPropagation();

                    var enterKeyCode = 13;

                    if (event.keyCode === enterKeyCode) {
                        scope.searchHandler();
                    }

                    scope.startDateOpened = false;
                    scope.endDateOpened = false;
                };

                scope.$on('search-page-event', function (event, args) {
                    search(args.pageNumber);
                });

                scope.searchHandler = function ($event) {
                    if (!!$event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }

                    if (scope.showDates &&
                        !scope.startDate) {

                        bootbox.alert("Start date is not valid.");

                        return;
                    }

                    if (scope.showDates &&
                        !scope.endDate) {

                        bootbox.alert("End date is not valid.");

                        return;
                    }

                    if (moment(scope.startDate).isValid() &&
                        moment(scope.endDate).isValid() &&
                        moment(scope.startDate).isAfter(moment(scope.endDate))) {

                        bootbox.alert("End date must be after start date.");

                        return;
                    }

                    search(1);
                };

                var search = function (pageNumber) {
                    if (moment(scope.startDate).year() < 1968) {
                        scope.startDate = moment(scope.startDate).year(moment(scope.startDate).year() + 100).format('l');
                    }
                    if (moment(scope.endDate).year() < 1968) {
                        scope.endDate = moment(scope.endDate).year(moment(scope.endDate).year() + 100).format('l');
                    }

                    var startDate = scope.showDates && moment(scope.startDate).isValid() ? moment(scope.startDate).format('MM-DD-YYYY') : '';
                    var endDate = scope.showDates && moment(scope.endDate).isValid() ? moment(scope.endDate).format('MM-DD-YYYY') : '';

                    scope.onSearch()(scope.searchTerm, startDate, endDate, pageNumber).then(function (val) {
                        $timeout(function () {
                            scope.startDateOpened = false;
                            scope.endDateOpened = false;
                        }, 10);
                    });
                };

                scope.toggleDates = function ($event) {
                    // This fires twice on enter and space bar
                    // Known issue:  https://github.com/angular/angular.js/issues/10388
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.showDates = !scope.showDates;

                    if (!scope.showDates) {
                        scope.clear();
                        scope.startDateOpened = false;
                        scope.endDateOpened = false;
                    }
                };

                function populatePage() {
                    if (!_.isUndefined($location.search().searchTerm)) {
                        scope.searchTerm = $location.search().searchTerm;
                    }
                    if (!_.isUndefined($location.search().startDate) &&
                        $location.search().startDate.length > 0) {
                        scope.startDate = moment($location.search().startDate).format('l');
                        scope.showDates = true;
                    }
                    if (!_.isUndefined($location.search().endDate) &&
                        $location.search().endDate.length > 0) {
                        scope.endDate = moment($location.search().endDate).format('l');
                        scope.showDates = true;
                    }

                    search(1);
                }

                function isSearch() {
                    return $location.path().indexOf('search') !== -1;
                }

                $rootScope.$on("$routeChangeSuccess", function () {
                    if (isSearch()) {
                        populatePage();
                    }
                });
            }
        };
    }
})();