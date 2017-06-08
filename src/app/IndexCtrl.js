// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function () {

    'use strict';

    angular
        .module('Samtec.MIS.Soundboard.Web')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', '$window'];

    function IndexController($scope, $window) {

        var sounds = [
            '/src/assets/sounds/BluesBrothersElevator.mp3',
            '/src/assets/sounds/Circus.mp3',
            '/src/assets/sounds/Crickets.mp3',
            '/src/assets/sounds/FailureToCommunicate.mp3',
            '/src/assets/sounds/GameOverMan.mp3',
            '/src/assets/sounds/LoserHorn.mp3',
            '/src/assets/sounds/ThugLife.mp3',
            "/src/assets/sounds/WhaWha.mp3",
            "/src/assets/sounds/KillMeNow.mp3"
        ];

        var audio = new Audio();

        $scope.onSoundClick = function (index) {
            audio.src = sounds[index];
            audio.play();
        };

        $scope.onStop = function () {
            audio.pause();
            audio.currentTime = 0;
        };


        $scope.onSmiley = function () {
            $window.open('http://rathergood.com/punk_kittens/', '_blank');
        };
    }
})();