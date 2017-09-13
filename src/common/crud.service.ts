import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { AuthService } from './auth.service';
import { AppConfigService } from './app-config.service';
import { EventManagerService } from '../common/event-manager.service';

import { IListOptions } from '../common/list-options.interface';

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

    public get resource(): string {
        return this.resourceName;
    }

    constructor(resourceName: string,
        public http: Http,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super(http, authService, appConfig, eventsManagerService);

        this.resourceName = resourceName;
    }

    public list(config?: IListOptions, options?: any): Observable<any> {
        return this.get(this.resourceName, config, options);
    }

    public read(resourceId: string, config: IListOptions = {}): Observable<any> {
        const { fields, options } = config;
        return this.get(this.resourceName + '/' + resourceId, { fields }, options);
    }

    public save(resource: any, options?: any): Observable<any> {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], resource, options);
        } else {
            return this.post(this.resourceName, resource, options);
        }
    }

    public delete(resourceId: string, options?: any): Observable<any> {
        return super.delete(this.resourceName + '/' + resourceId, options);
    }

    public addParent(resource: any, type: string, parent: any, context?: string) {
        let existingParentIndex: number = -1;

        if (!resource.parents) {
            resource.parents = [];
        } else {
            existingParentIndex = resource.parents.findIndex((item: any) => {
                if (context) {
                    return item.id == parent._id && item.type == type && item.context == context;
                } else {
                    return item.id == parent._id && item.type == type
                }
            });
        }

        if (!parent || !parent._id) {
            throw new Error('Invalid parent or parent.id when adding');
        }

        let parentObject: any = { id: parent._id, type, name: parent.name };

        if (context) {
            parentObject.context = context;
        }

        if (existingParentIndex >= 0) {
            resource.parents[existingParentIndex] = parentObject;
        } else {
            resource.parents.push(parentObject);
        }

        return resource;
    }
}
