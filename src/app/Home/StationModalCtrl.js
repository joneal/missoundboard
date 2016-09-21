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

    StationModalController.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$window', 'cache', 'ENV', 'station'];

    function StationModalController($scope, $uibModal, $uibModalInstance, $window, cache, ENV, station) {

        $scope.Station = station;

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
                });
            }, function no() { });
        };

        $scope.onDescriptionClick = function (data) {
            // Link to release notes, or download?
            $window.open(data.ReleaseNotesLink, '_blank');
        };

        $scope.onOK = function () {
            $uibModalInstance.close();
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {
        })();
    }
})();