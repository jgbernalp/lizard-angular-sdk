import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LocalStorageService {
    private prefix: string = 'lizard-';

    public set(key: string, value: any) {
        if (typeof value.toStorageItem === 'function') {
            value = value.toStorageItem();
        }

        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    public get(key: string): any {
        const value = localStorage.getItem(this.prefix + key);

        if (value != null) {
            return JSON.parse(value);
        }

        return null;
    }

    public remove(key: string) {
        localStorage.removeItem(key);
    }

}
