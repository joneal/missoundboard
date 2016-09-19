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
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$rootScope', '$scope', '$q', '$timeout', '$interval', 'cache', '$window', '$location', '$uibModal', 'toastr', 'UtilService'];

    function IndexController($rootScope, $scope, $q, $timeout, $interval, cache, $window, $location, $uibModal, toastr, UtilService) {

        $scope.Username = '';
        $scope.Copyright = '';

        // var revertToLogin = null;

        $scope.onUsernameClick = function () {
            $scope.Username = '';           
            $window.location.replace('/#/login');
        };

        $scope.$on('user-login', function (event, data) {
            $scope.Username = data;
        });

       
        // $rootScope.$on('$locationChangeStart', function (event, next, current) {

        //     // If no activity in 30 seconds, then return to login page
        //     if (next.indexOf('!!home') > -1) {
        //         console.log('Starting logout timer');
        //         revertToLogin = $timeout(function () {
        //             $window.location.replace('/#/login');
        //         }, 30 * 1000);
        //     }

        //     if (current.indexOf('!!home') > -1) {
        //         console.log('Stopping logout timer');
        //         $timeout.cancel(revertToLogin);
        //     }
        // });

        // Handler for 'notify-message-event', from parent scope
        $scope.$on('notify-message-event', function (e, args) {
            switch (args[0]) {
                case cache.NotifyMessageTypes.Information:
                    showNotificationModal('md', 'Information', args[1]);
                    break;
                case cache.NotifyMessageTypes.Warning:
                    showNotificationModal('md', 'Warning', args[1]);
                    break;
                case cache.NotifyMessageTypes.Success:
                    showSuccessMessage('Success', args[1]);
                    return;
                default:
                    showNotificationModal('md', 'Error', args[1]);
                    break;
            }
        });

        function showNotificationModal(size, title, content) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Notification/MessageBox.html',
                controller: 'MessageBoxController',
                animation: false,
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function ok() {
            });
        }

        function showSuccessMessage(header, message) {
            var options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-full-width",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            toastr.success(message, header, options);
        }
      
        // Controller initialization
        (function init() {

            var now = new Date();

            // Build the copyright information, using the current year i.e. '1976 - now'
            $scope.Copyright = now.getFullYear() + ' Samtec, Inc.';
         
        })();
    }
})();