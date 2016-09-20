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

    HomeController.$inject = ['$scope', '$window', '$timeout', '$document', 'cache', '$uibModal', 'UtilService', 'ENV'];

    function HomeController($scope, $window, $timeout, $document, cache, $uibModal, UtilService, ENV) {

        var HEADER_ROW_HEIGHT = 40;
        var ROW_HEIGHT = 40;
        var PANEL_HEIGHT = 200;

        var s3 = null;

        $scope.Data = {};
        $scope.ActiveTab = 0;

        $scope.GridOptions = {
            angularCompileRows: true,
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

        $scope.onPackagesView = function () {
            $scope.ActiveTab = 1;
            $scope.GridOptions.api.setColumnDefs([
                {
                    field: 'Name', headerName: 'Package', width: 100,
                    template: '<span><a href="" ng-click="onPackageClick(data)"; ng-bind="data.Name"></a></span>'
                },
                { field: 'Build', headerName: 'Build', width: 75 },
                { field: 'ReleaseDate', headerName: 'Release Date', width: 75, cellRenderer: dateRenderer },
                {
                    field: 'Description', headerName: 'Description',
                    template: '<span ng-bind="data.Description"></span>&nbsp;<a href="" ng-click="onPackageDescriptionClick(data)";><i class="fa fa-info-circle"></i></a>'
                }
            ]);
            $scope.GridOptions.api.setRowData($scope.Data.Packages);
        };

        function dateRenderer(params) {
            return moment(params.data.ReleaseDate).format('ll');
        }

        $scope.onPackageClick = function (data) {
            $uibModal.open({
                templateUrl: 'Notification/YesNoNotification.html',
                controller: 'YesNoNotificationController',
                animation: false,
                size: 'md',
                resolve: {
                    title: function () {
                        return 'Download?';
                    },
                    content: function () {
                        return 'Do you wish to download package - ' + data.Name.toUpperCase() + '?';
                    }
                }
            }).result.then(function yes() {
                var fileName = data.Filename;
                var filePath = data.FilePath + '/' + fileName;
                s3.getObject({ Bucket: 'anduin-installers', Key: filePath }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        saveAs(new Blob([data.Body], { type: 'application/octet-stream' }), fileName);
                    }
                });
            }, function no() { });
        };

        $scope.onPackageDescriptionClick = function (data) {
            // Link to release notes, or download?
            $window.open(data.ReleaseNotesLink, '_blank');
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

        // Convert an array buffer to a string
        function ab2str(buf) {
            return String.fromCharCode.apply(null, new Uint16Array(buf));
        }

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            // Download from AWS S3 via service?
            AWS.config.update({ accessKeyId: ENV.AWS_ACCESS_KEY_ID, secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY });
            AWS.config.region = 'us-east-1';

            s3 = new AWS.S3();

            s3.getObject({ Bucket: 'anduin-installers', Key: 'manifest.json' }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    // The object pulled from S3 will be in the format of "application/octet-stream", which is essentially
                    // a binary array (in the 'Body' property).  Convert the binary array of data to a string, and then parse
                    // the string to a JSON object.
                    var jsonString = ab2str(data.Body);
                    var object = JSON.parse(jsonString);
                    $scope.Data.Stations = data.Stations;
                    $scope.Data.Packages = object.Packages;
                    $scope.onStationsView();
                }
            });
        })();
    }
})();