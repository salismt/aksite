'use strict';

angular.module('aksiteApp')
	.factory('Upload', function Auth($resource) {
		return $resource('/api/upload/:id/:controller', {
			id: '@_id'
		});
	});