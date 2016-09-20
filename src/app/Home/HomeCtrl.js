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

        $scope.ChildData = {};

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
                    field: 'Name', headerName: 'Station', width: 100,
                    cellRenderer: 'group', cellRendererParams: { innerRenderer: stationRenderer }
                },
                { field: 'Build', headerName: 'Build', width: 75, suppressSorting: true },
                { field: 'ReleaseDate', headerName: 'Release Date', width: 50, suppressSorting: true, cellRenderer: dateRenderer },
                {
                    field: 'Description', headerName: 'Description', suppressSorting: true,
                    template: '<span ng-bind="data.Description"></span>&nbsp;<a href="" ng-if="data.ReleaseNotesLink" ng-click="onDescriptionClick(data);"><i class="fa fa-info-circle"></i></a>'
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
                { field: 'Build', headerName: 'Build', width: 75, suppressSorting: true },
                { field: 'ReleaseDate', headerName: 'Release Date', width: 50, suppressSorting: true, cellRenderer: dateRenderer },
                {
                    field: 'Description', headerName: 'Description', suppressSorting: true,
                    template: '<span ng-bind="data.Description"></span>&nbsp;<a href="" ng-if="data.ReleaseNotesLink" ng-click="onDescriptionClick(data);"><i class="fa fa-info-circle"></i></a>'
                }
            ]);
            $scope.GridOptions.api.setRowData($scope.Data.Packages);
        };

        function stationRenderer(params) {
            return '&nbsp;<span>' + params.data.Name + '</span>';
        }

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

        $scope.onDescriptionClick = function (data) {
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
            // The flower row shares the same data as the parent row
            $scope.ChildData.Packages = params.node.data.Packages;
            //$scope.ChildGridOptions.api.setRowData($scope.ChildData.Packages);

            var template =
                '<div class="full-width-panel ag-shadow">' +
                '  <div class="full-width-center">' + 'Howdy' + 
                //'     <div class="ag-samtec ag-shadow" ag-grid="ChildGridOptions" style="height:100%;"></div>' +
                '  </div>' +
                '</div>';

            return template;
        };

        FullWidthCellRenderer.prototype.getGui = function () {
            return this.eGui;
        };

        // If we don't do this, then the mouse wheel will be picked up by the main
        // grid and scroll the main grid and not this component. This ensures that
        // the wheel move is only picked up by the text field.
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

        $scope.ChildGridOptions = {
            columnDefs: [
                { field: 'Name', headerName: 'Package', width: 100 },
                { field: 'Build', headerName: 'Build', width: 75, suppressSorting: true },
                //{ field: 'ReleaseDate', headerName: 'Release Date', width: 50, suppressSorting: true, cellRenderer: dateRenderer },
                { field: 'Description', headerName: 'Description', suppressSorting: true }
            ],
            angularCompileRows: true,
            headerHeight: 25,
            rowHeight: 25,
            enableColResize: true,
            enableSorting: true,
            suppressHorizontalScroll: false,
            onModelUpdated: function (param) { $scope.ChildGridOptions.api.sizeColumnsToFit(); },
            rowSelection: 'none',
            sortingOrder: ['asc', 'desc'],
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
                    $scope.Data.Stations = object.Stations;
                    $scope.Data.Packages = object.Packages;

                    // Fixup Packages list in each Station.  Only the 'Name' and 'Build' properties are 
                    // set in the Packages list of each Station.  So loop thru the general Packages list and find 
                    // a match based on 'Name' and 'Build'.  Once found, create new properties in the Station Package for 
                    // ReleaseDate, Description, etc.
                    _.forEach($scope.Data.Stations, function(station){
                        _.forEach(station.Packages, function(stationPackage){
                            var p = _.find($scope.Data.Packages, {Name: stationPackage.Name, Build: stationPackage.Build});
                            if(p){
                                stationPackage.ReleaseDate = p.ReleaseDate;
                                stationPackage.Description = p.Description;
                                stationPackage.ReleaseNotesLink = p.ReleaseNotesLink;
                                stationPackage.Filename = p.Filename;
                                stationPackage.FilePath = p.FilePath;
                            }
                        });
                    });

                    // Start by showing the Stations tab / data.
                    $scope.onStationsView();
                }
            });
        })();
    }
})();