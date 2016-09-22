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
        .controller('StationModalController', StationModalController);

    StationModalController.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$window', '$timeout', 'cache', 'ENV', 'station'];

    function StationModalController($scope, $uibModal, $uibModalInstance, $window, $timeout, cache, ENV, station) {

        $scope.Station = station;

        $scope.onPackageClick = function (pkg) {
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
                        return 'Do you wish to download package - ' + pkg.Name.toUpperCase() + '?';
                    }
                }
            }).result.then(function yes() {

                var fileName = pkg.Filename;
                var filePath = pkg.FilePath + '/' + fileName;

                var downloadPath = cache.ANDUIN_INSTALLER_URL + '/' + filePath;

                $window.open(downloadPath, '_self');

            }, function no() { });
        };

        $scope.onDescriptionClick = function (data) {
            // Link to release notes, or download?
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        $scope.onStationPackages = function () {

            _.forEach($scope.Station.Packages, function (pkg) {
                var fileName = pkg.Filename;
                var filePath = pkg.FilePath + '/' + fileName;

                var downloadPath = cache.ANDUIN_INSTALLER_URL + '/' + filePath;

                $window.open(downloadPath, '_self');
            });

        };

        $scope.onEditConfig = function () {

        };

        $scope.onOK = function () {
            $uibModalInstance.close();
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            // Sort the packages
            $scope.Station.Packages = _.sortBy($scope.Station.Packages, ['Name']);

        })();
    }
})();