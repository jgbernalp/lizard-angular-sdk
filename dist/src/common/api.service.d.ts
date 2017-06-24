import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';
export declare class APIService {
    http: Http;
    authService: AuthService;
    private apiURL;
    private clientId;
    private clientSecret;
    constructor(http: Http, authService: AuthService);
    get(path: string, query?: any, options?: any): Observable<any>;
    put(path: string, data?: any, query?: any, options?: any): Observable<any>;
    post(path: string, data?: any, query?: any, options?: any): Observable<any>;
    delete(path: string, query?: any, options?: any): Observable<any>;
    private getRequestOptions(options?);
    private getUrlParams(data);
    private extractData(res);
    private handleError(error);
}
