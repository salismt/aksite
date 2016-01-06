'use strict';

export default function UserEditorController($scope, $http, $stateParams, $state, $sanitize, Upload, Auth) {
    $scope.loadingUser = true;
    $scope.currentUser = Auth.getCurrentUser();
    if(!$stateParams.userId) {
        $scope.user = {
            name: 'New User',
            email: 'test@example.com',
        };
        $scope.loadingUser = false;
    } else {
        $http.get('/api/users/' + $stateParams.userId)
            .success(function(res) {
                console.log(res);
                $scope.user = res;
                $scope.filename = $scope.user.imageId;
            })
            .error(function(res, status) {
                $scope.error = {status: status, res: res};
            })
            .finally(function() {
                $scope.loadingUser = true;
            });
    }
    console.log($scope.currentUser);

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];

        if(!file) {
            $scope.filename = null;
            $scope.fileToUpload = null;
        } else {
            $scope.filename = file.name;
            $scope.fileToUpload = file;
        }
    };

    $scope.saveUser = function(form) {
        $scope.submitted = true;
        console.log(form);

        if(form.$valid) {
            if($scope.filename === $scope.user.imageId || $scope.filename === null) {
                $scope.upload = Upload.upload({
                        url: 'api/users/' + $scope.user._id,
                        method: 'PUT',
                        fields: $scope.user
                    })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                    })
                    .success(function(data, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(data);
                        $state.go('admin.users');
                    })
                    .error(function(response, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(response);
                    })
                    .xhr(function(xhr) {
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            } else {
                var updated = $scope.user;
                updated.newImage = true;
                $scope.upload = Upload.upload({
                        url: 'api/users/' + $scope.user._id,
                        method: 'PUT',
                        file: $scope.fileToUpload,
                        fields: updated
                    })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                    })
                    .success(function(data, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(data);
                        $state.go('admin.users');
                    })
                    .error(function(response, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(response);
                    })
                    .xhr(function(xhr) {
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            }
        }
    };

    $scope.cancel = function() {
        if($scope.upload)
            $scope.upload.abort();
        $state.go('admin.users');
    };
};
