'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.files', {
            url: '/files',
            template: require('./fileManager.html'),
            controller: 'FileManagerController',
            controllerAs: 'fileManager'
        });
}
