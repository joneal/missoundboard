// Copyright (C) 1976-2016, Samtec
// All rights are reserved.
// Samtec proprietary information: the enclosed materials contain proprietary information
// of Samtec and shall not be disclosed in whole or in any part to any third party
// or used by any person for any purpose, without the express written consent of Samtec.
// Duplication of any portion of these materials shall include this legend.

(function utilsvc() {

    'use strict';

    angular
        .module('Samtec.Anduin.Installer.Web')
        .factory('AwsService', AwsService);

    AwsService.$inject = ['ENV'];

    function AwsService(ENV) {

        var BUCKET = 'anduin-installers';

        AWS.config.update({ accessKeyId: ENV.AWS_ACCESS_KEY_ID, secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY });
        AWS.config.region = 'us-east-1';

        var s3 = new AWS.S3();

        function getFile(key) {
            return new Promise(function (resolve, reject) {
                var params = { Bucket: BUCKET, Key: key };
                s3.getObject(params, function (err, data) {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }

        function putObject(key, object) {
            return new Promise(function (resolve, reject) {
                var params = { Bucket: BUCKET, Key: key, Body: object };
                s3.putObject(params, function (err, data) {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }

        function getPresignedUrl(key) {
            return new Promise(function (resolve, reject) {
                var params = { Bucket: BUCKET, Key: key };
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (!err) {
                        resolve(url);
                    } else {
                        console.log(err);
                        reject(err);
                    }
                });
            });
        }

        return {
            GetFile: getFile,
            PutObject: putObject,
            GetPresignedUrl: getPresignedUrl
        };
    }

})();