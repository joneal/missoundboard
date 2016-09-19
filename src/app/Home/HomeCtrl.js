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

        var HEADER_ROW_HEIGHT = 40;
        var ROW_HEIGHT = 40;
        var PANEL_HEIGHT = 200;

        $scope.Data = {};
        $scope.ActiveTab = 0;

        $scope.GridOptions = {
            // angularCompileRows: true,
            //rowHeight: ROW_HEIGHT,
            headerHeight: HEADER_ROW_HEIGHT,
            enableColResize: true,
            enableSorting: true,
            enableFilter: false,
            suppressHorizontalScroll: false,
            onModelUpdated: function (param) { $scope.GridOptions.api.sizeColumnsToFit(); },
            rowSelection: 'none',
            sortingOrder: ['asc', 'desc'],
            isFullWidthCell: function (rowNode) {
                return rowNode.flower;
            },
            fullWidthCellRenderer: FullWidthCellRenderer,
            getRowHeight: function (params) {               
                return params.node.flower ? PANEL_HEIGHT : ROW_HEIGHT;
            },
            doesDataFlower: function (dataItem) {
                return true;
            }
        };

        $scope.onStationsView = function () {
            $scope.ActiveTab = 0;
            $scope.GridOptions.api.setColumnDefs([
                {
                    field: 'Station', headerName: 'Station', width: 100,
                    //template: '<span><a href="" ng-click="onStationClick(data)"; ng-bind="data.Station"></a></span>'
                    cellRenderer: 'group'
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
                    field: 'Package', headerName: 'Package', width: 100,
                    // template: '<span><a href="" ng-click="onStationClick(data)"; ng-bind="data.Package"></a></span>'
                    cellRenderer: 'group'
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

        function FullWidthCellRenderer() { }

        FullWidthCellRenderer.prototype.init = function (params) {
            // trick to convert string of html into dom object
            var eTemp = document.createElement('div');
            eTemp.innerHTML = this.getTemplate(params);
            this.eGui = eTemp.firstElementChild;

            this.consumeMouseWheelOnCenterText();
        };

        FullWidthCellRenderer.prototype.getTemplate = function (params) {
            // the flower row shares the same data as the parent row
            // var data = params.node.data;

            var template =
                '<div class="full-width-panel ag-shadow">' +
                '  <div class="full-width-center">' + 'Howdy' +
                '  </div>' +
                '</div>';

            return template;
        };

        FullWidthCellRenderer.prototype.getGui = function () {
            return this.eGui;
        };

        // if we don't do this, then the mouse wheel will be picked up by the main
        // grid and scroll the main grid and not this component. this ensures that
        // the wheel move is only picked up by the text field
        FullWidthCellRenderer.prototype.consumeMouseWheelOnCenterText = function () {
            var eFullWidthCenter = this.eGui.querySelector('.full-width-center');

            var mouseWheelListener = function (event) {
                event.stopPropagation();
            };

            // event is 'mousewheel' for IE9, Chrome, Safari, Opera
            eFullWidthCenter.addEventListener('mousewheel', mouseWheelListener);
            // event is 'DOMMouseScroll' Firefox
            eFullWidthCenter.addEventListener('DOMMouseScroll', mouseWheelListener);
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
                $scope.onStationsView();
            }).catch(function (err) {
                UtilService.Error('Error getting components data');
            });

        })();
    }
})();