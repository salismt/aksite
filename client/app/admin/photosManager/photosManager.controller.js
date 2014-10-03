'use strict';

angular.module('aksiteApp')
    .controller('PhotosManagerCtrl', function ($scope, $upload, Photo, Upload) {
        $scope.photo = {
            hidden: false
        };
        $scope.errors = {};
        $scope.dropSupported = true;

        // Use the User $resource to fetch all users
        $scope.photos = Photo.query();

		$scope.uploads = Upload.query();

        $scope.addPhoto = function(form) {
            console.log(Photo);

            $scope.submitted = true;

            if (form.$valid) {
                Photo.save({
                    name: $scope.photo.name,
                    info: $scope.photo.info || '',
                    active: true
                })
                .catch(function (err) {
                    err = err.data;
                    $scope.errors.other = err.message;

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                    });
                });
                $scope.photos = Photo.query();
            }
        };

        $scope.deletePhoto = function (photo) {
            Photo.remove({ id: photo._id });
            angular.forEach($scope.photos, function (u, i) {
                if (u === photo) {
                    $scope.photos.splice(i, 1);
                }
            });
        };

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'server/upload/url', //upload.php script, node.js route, or servlet url
                    //method: 'POST' or 'PUT',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {myObj: $scope.photo},
                    file: file // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name.
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
                //.error(...)
                //.then(success, error, progress);
                // access or attach event listeners to the underlying XMLHttpRequest.
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };
    });
