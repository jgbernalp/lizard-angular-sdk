import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { AppConfig } from './app-config.factory';

@Injectable()
export class APIService {
    private apiURL: string;
    private clientId: string | undefined;
    private clientSecret: string | undefined;

    constructor(public http: Http, public authService: AuthService) {
        this.apiURL = AppConfig.config.apiUrl;
        this.clientId = AppConfig.config.clientId;
        this.clientSecret = AppConfig.config.clientSecret;
    }

    public get(path: string, query?: any, options?: any): Observable<any> {
        return this.http.get(this.apiURL + '/' + path + this.getUrlParams(query),
            this.getRequestOptions(options))
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

        if (!options || options.credentials === undefined || options.credentials === true) {
            headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
        }

        return requestOptions;
    }

    private getUrlParams(data: any): string {
        let urlParams = '';

        if (data) {
            const params = [];
            const keys = Object.keys(data);
            for (const key of keys) {
                params.push(key + '=' + encodeURIComponent(data[key]));
            }

            if (params.length > 0) {
                urlParams = '?' + params.join('&');
            }
        }

        return urlParams;
    }

    private extractData(res: Response) {
        const body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        // TODO use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}
