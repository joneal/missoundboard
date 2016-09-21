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

    HomeController.$inject = ['$scope', '$window', '$timeout', '$document', '$templateCache', 'cache', '$uibModal', 'UtilService', 'ENV'];

    function HomeController($scope, $window, $timeout, $document, $templateCache, cache, $uibModal, UtilService, ENV) {

        var HEADER_ROW_HEIGHT = 40;
        var ROW_HEIGHT = 40;
        var PANEL_HEIGHT = 200;

        var s3 = null;

        $scope.Data = {};
        $scope.ActiveTab = 0;

        //$scope.ChildData = {};

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

        // Called when the user clicks on the 'Stations' tab
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

        // Called when the user clicks on the 'Packages' tab
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

        // Add some space between the contract/expand icon and the station name
        function stationRenderer(params) {
            return '&nbsp;<span>' + params.data.Name + '</span>';
        }

        // Show any dates in local 'MMM d, yyyy' format
        function dateRenderer(params) {
            return moment(params.data.ReleaseDate).format('ll');
        }

        // Called when the user clicks on the 'Package' name i.e. the link
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

        // Called when the user clicks on the 'Description' information icon
        $scope.onDescriptionClick = function (data) {
            // Link to release notes, or download?
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        // FullWidthCellRenderer is used to create/display the child panel that is display below a row
        // when the user clicks on the contract/expand icon by the Station name, to expand the child panel.
        function FullWidthCellRenderer() { }

        FullWidthCellRenderer.prototype.init = function (params) {
            // trick to convert string of html into dom object
            var eTemp = document.createElement('div');
            eTemp.innerHTML = this.getTemplate(params);
            this.eGui = eTemp.firstElementChild;

            //this.consumeMouseWheelOnCenterText();
        };

        FullWidthCellRenderer.prototype.getTemplate = function (params) {
            // The flower row shares the same data as the parent row
            //$scope.ChildData.Station = params.node.data;

            // _.forEach($scope.ChildData.Station.Packages, function(p){
            //     p.ReleaseDate = new Date(p.ReleaseDate);
            // });
  
            return $templateCache.get('Home/ChildPanel.html');          
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

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            // Download from AWS S3 via service?
            AWS.config.update({ accessKeyId: ENV.AWS_ACCESS_KEY_ID, secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY });
            AWS.config.region = 'us-east-1';

            s3 = new AWS.S3();

            // Download the 'manifest.json' file from S3. It will be used to drive both the 'Stations' and 'Packages' grids.
            s3.getObject({ Bucket: 'anduin-installers', Key: 'manifest.json' }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    // The object pulled from S3 will be in the format of "application/octet-stream", which is essentially
                    // a binary array (in the 'Body' property).  Convert the binary array of data to a string, and then parse
                    // the string to a JSON object.
                    var jsonString = String.fromCharCode.apply(null, new Uint16Array(data.Body)); 
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