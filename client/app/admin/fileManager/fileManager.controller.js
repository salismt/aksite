'use strict';

export default class FileManagerController {
    /*@ngInject*/
    constructor($http) {
        $http.get('/api/upload')
            .then(res => {
                this.files = res.data.items;
                this.page = res.data.page;
                this.pages = res.data.pages;
                this.numItems = res.data.numItems;
            }, console.log.bind(console));
    }

    openFile(file) {
        console.log(file);
    }

    deleteFile(file) {
        console.log(file);
    }
}
