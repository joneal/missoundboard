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

        var s3 = null;
        var awsRequest = null;

        $scope.Data = {};
        $scope.ActiveTab = 0;

        $scope.GridOptions = {
            angularCompileRows: true,
            headerHeight: HEADER_ROW_HEIGHT,
            rowHeight: ROW_HEIGHT,
            enableColResize: true,
            enableSorting: true,
            enableFilter: false,
            suppressHorizontalScroll: false,
            onModelUpdated: function (param) { $scope.GridOptions.api.sizeColumnsToFit(); },
            rowSelection: 'none',
            sortingOrder: ['asc', 'desc']
        };

        // Called when the user clicks on the 'Stations' tab
        $scope.onStationsView = function () {
            $scope.ActiveTab = 0;
            $scope.GridOptions.api.setColumnDefs([
                {
                    field: 'Name', headerName: 'Station', width: 100, sort: 'asc',
                    template: '<span><a href="" ng-click="onStationClick(data)"; ng-bind="data.Name"></a></span>'
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
                    field: 'Name', headerName: 'Package', width: 100, sort: 'asc',
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

        // Show any dates in local 'MMM d, yyyy' format
        function dateRenderer(params) {
            return moment(params.data.ReleaseDate).format('ll');
        }

        // Called when the user clicks on the 'Station' name i.e. the link
        $scope.onStationClick = function (data) {
            $uibModal.open({
                templateUrl: 'Home/StationModal.html',
                controller: 'StationModalController',
                animation: false,
                size: 'station',
                resolve: {
                    station: function () {
                        return data;
                    }
                }
            }).result.then(function ok() {

            });
        };

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
                cache.S3.getObject({ Bucket: 'anduin-installers', Key: filePath }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        saveAs(new Blob([data.Body], { type: 'application/octet-stream' }), fileName);
                    }
                }).on('httpDownloadProgress', function (progress) {
                    console.log(progress);
                });
            }, function no() { });
        };

        // Called when the user clicks on the 'Description' information icon
        $scope.onDescriptionClick = function (data) {
            // Link to release notes, or download?
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            // Download the 'manifest.json' file from S3. It will be used to drive both the 'Stations' and 'Packages' grids.
            cache.S3.getObject({ Bucket: 'anduin-installers', Key: 'manifest.json' }, function (err, data) {
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
                    _.forEach($scope.Data.Stations, function (station) {
                        _.forEach(station.Packages, function (stationPackage) {
                            var p = _.find($scope.Data.Packages, { Name: stationPackage.Name, Build: stationPackage.Build });
                            if (p) {
                                stationPackage.ReleaseDate = new Date(p.ReleaseDate);
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