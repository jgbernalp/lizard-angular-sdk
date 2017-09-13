import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';
import { AppConfigService } from './app-config.service';
import { EventManagerService } from '../common/event-manager.service';
import { IListOptions } from '../common/list-options.interface';
export declare class APIService {
    http: Http;
    authService: AuthService;
    appConfig: AppConfigService;
    eventsManagerService: EventManagerService;
    private apiURL;
    private clientId;
    private clientSecret;
    constructor(http: Http, authService: AuthService, appConfig: AppConfigService, eventsManagerService: EventManagerService);
    get(path: string, config?: IListOptions, options?: any): Observable<any>;
    put(path: string, data?: any, query?: any, options?: any): Observable<any>;
    post(path: string, data?: any, query?: any, options?: any): Observable<any>;
    delete(path: string, query?: any, options?: any): Observable<any>;
    private getRequestOptions(options?);
    private getUrlParams(data);
    private extractData(res);
    private handleError(error);
}
