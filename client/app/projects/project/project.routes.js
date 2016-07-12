'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('project', {
            url: '/projects/:projectId',
            template: '<project></project>',
            onEnter($rootScope) {
                $rootScope.title = `${$rootScope.titleRoot} | Projects`;
            }
        });
}
