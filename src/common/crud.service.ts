import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { AuthService } from './auth.service';

@Injectable()
export class CRUDService extends APIService {
    private resourceName: string;
    private localResourceIdName: string = '_id';

    public set resourceIdName(value: string) {
        this.localResourceIdName = value;
    }

    public get resourceIdName(): string {
        return this.localResourceIdName;
    }

    constructor(resourceName: string, public http: Http, public authService: AuthService) {
        super(http, authService);

        this.resourceName = resourceName;
    }

    public list(query: any = {}, limit?: number, fields?: [string], sort?: [string], options?: any): Observable<any> {
        return this.get(this.resourceName, { query, fields, sort }, options);
    }

    public read(resourceId: string, fields?: [string], options?: any): Observable<any> {
        return this.get(this.resourceName + '/' + resourceId, { fields }, options);
    }

    public save(resource: any, data: any, options: any): Observable<any> {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], data, options);
        } else {
            return this.post(this.resourceName, data, options);
        }
    }

    public delete(resourceId: string, options: any): Observable<any> {
        return super.delete(this.resourceName + '/' + resourceId, options);
    }
}
