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

    StationModalController.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$window', '$document', '$timeout', 'cache', 'ENV', 'station'];

    function StationModalController($scope, $uibModal, $uibModalInstance, $window, $document, $timeout, cache, ENV, station) {

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
                var downloadPath = createFilePath(pkg);
                $window.open(downloadPath, '_self');
            });
        };

        $scope.onDescriptionClick = function (data) {
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        $scope.onStationPackages = function () {
            var files = [];
            _.forEach($scope.Station.Packages, function (pkg) {
                var downloadPath = createFilePath(pkg);
                files.push({ filename: downloadPath, download: downloadPath });
            });
            downloadFiles(files);
        };

        $scope.onEditConfig = function () {

        };

        $scope.onOK = function () {
            $uibModalInstance.close();
        };

        function createFilePath(pkg) {
            return cache.ANDUIN_INSTALLER_URL + '/' + pkg.FilePath + '/' + pkg.Filename;
        }

        // http://stackoverflow.com/questions/2339440/download-multiple-files-with-a-single-action
        function downloadFiles(files) {
            function downloadNext(i) {
                if (i >= files.length) {
                    return;
                }

                var a = document.createElement('a');
                a.href = files[i].download;
                a.target = '_parent';
                // Use a.download if available, it prevents plugins from opening.
                // if ('download' in a) {
                //     a.download = files[i].filename;
                // }
                // Add a to the doc for click to work.

                (document.body || $document.documentElement).appendChild(a);
                if (a.click) {
                    a.click(); // The click method is supported by most browsers.
                } else {
                    $(a).click(); // Backup using jquery
                }
                // Delete the temporary link.               
                a.parentNode.removeChild(a);
                // Download the next file with a small timeout. The timeout is necessary
                // for IE, which will otherwise only download the first file.
                setTimeout(function () { downloadNext(i + 1); }, 500);
            }
            // Initiate the first download.
            downloadNext(0);
        }

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {

            // Sort the packages
            $scope.Station.Packages = _.sortBy($scope.Station.Packages, ['Name']);

        })();
    }
})();