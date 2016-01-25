'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('userEditor', {
            url: '/admin/users/:userId',
            template: require('./userEditor.html'),
            controller: 'UserEditorController',
            controllerAs: 'vm'
        });
}
