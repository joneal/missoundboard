// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$window', '$timeout', 'cache', '$uibModal', 'HomeService', 'UtilService'];

    function HomeController($scope, $window, $timeout, cache, $uibModal, HomeService, UtilService) {

        $scope.Data = {};
        $scope.ActiveTab = 0;

        $scope.GridOptions = {
            angularCompileRows: true,
            enableColResize: true,
            enableSorting: true,
            enableFilter: false,
            suppressHorizontalScroll: false,
            onModelUpdated: function (param) { $scope.GridOptions.api.sizeColumnsToFit(); },
            rowHeight: 40,
            headerHeight: 40,
            rowSelection: 'none',
            sortingOrder: ['asc', 'desc']
        };

        $scope.onStationsView = function () {
            $scope.ActiveTab = 0;
            $scope.GridOptions.api.setColumnDefs([
                {
                    field: 'Station', headerName: 'Station', width: 100,
                    template: '<span><a href="" ng-click="onStationClick(data)"; ng-bind="data.Station"></a></span>'
                },
                { field: 'Build', headerName: 'Build', width: 75 },
                { field: 'ReleaseDate', headerName: 'Release Date', width: 75, cellRenderer: dateRenderer },
                {
                    field: 'Description', headerName: 'Description',
                    template: '<span ng-bind="data.Description"></span><a href="" ng-click="onStationDescriptionClick(data)";>&nbsp;...</a>'
                }
            ]);
            $scope.GridOptions.api.setRowData($scope.Data.Stations);
        };

        $scope.onComponentsView = function () {
            $scope.ActiveTab = 1;
            $scope.GridOptions.api.setColumnDefs([
                {
                    field: 'Station', headerName: 'Station', width: 100,
                    template: '<span><a href="" ng-click="onStationClick(data)"; ng-bind="data.Package"></a></span>'
                },
                { field: 'Build', headerName: 'Build', width: 75 },
                { field: 'ReleaseDate', headerName: 'Release Date', width: 75, cellRenderer: dateRenderer },
                {
                    field: 'Description', headerName: 'Description',
                    template: '<span ng-bind="data.Description"></span><a href="" ng-click="onStationDescriptionClick(data)";>&nbsp;...</a>'
                }
            ]);
            $scope.GridOptions.api.setRowData($scope.Data.Components);
        };

        function dateRenderer(params) {
            return moment(params.value).format('llll');
        }

        $scope.onDontClick = function () {
            $window.open('http://rathergood.com/punk_kittens/', '_blank');
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            HomeService.GetStationData().then(function (data) {
                $scope.Data.Stations = data;
                $scope.onStationsView();
            }).catch(function (err) {
                UtilService.Error('Error getting station data');
            });

            HomeService.GetComponentData().then(function (data) {
                $scope.Data.Components = data;
                //$scope.onStationsView();
            }).catch(function (err) {
                UtilService.Error('Error getting components data');
            });
            
        })();
    }
})();