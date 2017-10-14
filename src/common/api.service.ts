import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';

import { HttpInterceptor } from '../common/http-interceptor.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthService } from './auth.service';
import { AppConfigService } from './app-config.service';
import { EventManagerService } from '../common/event-manager.service';

import { IListOptions } from '../common/list-options.interface';

@Injectable()
export class APIService {
    private apiURL: string;
    private clientId: string | undefined;
    private clientSecret: string | undefined;

    constructor(public http: HttpInterceptor,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        this.apiURL = this.appConfig.config.apiURL;
        this.clientId = this.appConfig.config.clientId;
        this.clientSecret = this.appConfig.config.clientSecret;
    }

    public get(path: string, config?: IListOptions, options?: any): Observable<any> {
        return this.http.get(
            this.apiURL + '/' + path + this.getUrlParams(config), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }

    public put(path: string, data?: any, query?: any, options?: any): Observable<any> {
        return this.http.put(this.apiURL + '/' + path + this.getUrlParams(query), data,
            this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }

    public post(path: string, data?: any, query?: any, options?: any): Observable<any> {
        return this.http.post(this.apiURL + '/' + path +
            this.getUrlParams(query), data, this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }

    public delete(path: string, query?: any, options?: any): Observable<any> {
        return this.http.delete(this.apiURL + '/' + path +
            this.getUrlParams(query), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }

    private getRequestOptions(options?: any): RequestOptions {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ headers });

        if (!options || options.credentials === undefined || options.credentials === true ||
            options.credentials === 'app') {

            if (options !== undefined && options.credentials === 'app') {
                headers.append('Authorization', 'Bearer ' + this.authService.getAppAccessToken());
            } else {
                headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
            }
        }

        return requestOptions;
    }

    private getUrlParams(data: any): string {
        let urlParams = '';

        if (data) {
            const params = [];
            const keys = Object.keys(data);
            for (const key of keys) {
                if (data[key] !== undefined && String(data[key]).length > 0) {
                    let keyValue = data[key];
                    if (typeof keyValue === 'object') {
                        try {
                            keyValue = JSON.stringify(keyValue);
                        } catch (err) {
                            // do nothing
                        }
                    }

                    params.push(key + '=' + encodeURIComponent(keyValue));
                }
            }

            if (params.length > 0) {
                urlParams = '?' + params.join('&');
            }
        }

        return urlParams;
    }

    private extractData(res: Response) {
        return res.json();
    }

    private handleError(error: Response | any) {
        // TODO use a remote logging infrastructure
        let errObj: any;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errObj = err;
        } else {
            errObj = error;
        }
        return Observable.throw(errObj);
    }

}
