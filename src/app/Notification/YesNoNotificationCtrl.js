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
        .controller('YesNoNotificationController', YesNoNotificationController);

    YesNoNotificationController.$inject = ['$scope', '$uibModalInstance', '$sce', 'cache', 'title', 'content'];

    function YesNoNotificationController($scope, $uibModalInstance, $sce, cache, title, content) {

        $scope.Title = title;
        $scope.ShowTitle = (title !== '');
        $scope.Content = $sce.trustAsHtml(content);    

        $scope.onYes = function () {
            $uibModalInstance.close();
        };

        $scope.onNo = function () {
            $uibModalInstance.dismiss();
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {
        })();
    }
})();