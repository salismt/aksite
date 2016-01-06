'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('userEditor', {
            url: '/admin/users/:userId',
            template: require('./userEditor.html'),
            controller: 'UserEditorController'
        });
}
