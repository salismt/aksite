'use strict';

export default class SiteSettings {
    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    cleanOrphans() {
        this.$http.get('/api/upload/clean')
            .then(({data, status}) => {
                console.log(status);
                console.log(data);
            })
            .catch(({data, status}) => {
                console.log(status);
                console.log(data);
            });
    }
}
