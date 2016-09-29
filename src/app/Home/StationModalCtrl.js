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

    StationModalController.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$window', '$document', '$timeout', 'cache', 'AwsService', 'station'];

    function StationModalController($scope, $uibModal, $uibModalInstance, $window, $document, $timeout, cache, AwsService, station) {

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
                // Get the signed URL for the object in the bucket
                AwsService.GetPresignedUrl(pkg.FilePath + '/' + pkg.Filename).then(function (url) {
                    $window.open(url, '_self');
                }).catch(function (err) {
                    UtilService.Error('Error retrieving pre-signed URL for file');
                });
            });
        };

        $scope.onDescriptionClick = function (data) {
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        $scope.onStationPackages = function () {
            var files = [];

            // For the list of Packages for a station, create the path to the S3 object(s) to download
            _.forEach($scope.Station.Packages, function (pkg) {
                files.push(pkg.FilePath + '/' + pkg.Filename);
            });

            // For station specific files, such as <<readme>>.html and config.zip, create a path to the S3 object(s) to download
            _.forEach($scope.Station.StationFiles, function (file) {
                files.push($scope.Station.FilePath + '/' + file);
            });

            // Get the corresponding pre-signed URLs for each of the files to download
            var promises = [];

            _.forEach(files, function (file) {
                promises.push(AwsService.GetPresignedUrl(file));
            });

            Promise.all(promises).then(function (urls) {
                downloadFiles(urls);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        };

        $scope.onOK = function () {
            $uibModalInstance.close();
        };

        // http://stackoverflow.com/questions/2339440/download-multiple-files-with-a-single-action
        function downloadFiles(urls) {
            function downloadNext(i) {
                if (i >= urls.length) {
                    return;
                }

                var a = document.createElement('a');
                a.href = urls[i];
                a.target = '_parent';
                a.type = 'application/octet-stream';

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