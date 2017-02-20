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
        .controller('EditManifestModalController', EditManifestModalController);

    EditManifestModalController.$inject = ['$scope', '$uibModal', '$uibModalInstance', '$window', '$document', '$timeout', 'cache', 'AwsService', 'manifest'];

    function EditManifestModalController($scope, $uibModal, $uibModalInstance, $window, $document, $timeout, cache, AwsService, manifest) {

        $scope.Manifest = manifest;
        var editor = null;

        $scope.onOK = function () {
            var json = editor.get();
            $uibModalInstance.close(json);
        };

        $scope.onCancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.EditorOptions = { name: 'Manifest.json', mode: 'tree', indentation: 4 };
        var settingsChanged = false;

        $scope.onEditorLoad = function (jsonEditor) {
            editor = jsonEditor;
            jsonEditor._onAction = function (e, t) {
                settingsChanged = true;
            };
        };

        //----------------------------------------------------------------------------------------------------
        // Controller initialization
        //----------------------------------------------------------------------------------------------------
        (function init() {


        })();
    }
})();