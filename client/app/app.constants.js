import {Injectable} from '@angular/core';

@Injectable()
export default class Constants {
    constructor() {
        return require('../../server/config/environment/shared');
    }
}
