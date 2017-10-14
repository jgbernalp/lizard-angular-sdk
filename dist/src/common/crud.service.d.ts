import { Observable } from 'rxjs/Observable';
import { HttpInterceptor } from '../common/http-interceptor.service';
import { APIService } from './api.service';
import { AuthService } from './auth.service';
import { AppConfigService } from './app-config.service';
import { EventManagerService } from '../common/event-manager.service';
import { IListOptions } from '../common/list-options.interface';
export declare class CRUDService extends APIService {
    http: HttpInterceptor;
    authService: AuthService;
    appConfig: AppConfigService;
    eventsManagerService: EventManagerService;
    private resourceName;
    private localResourceIdName;
    resourceIdName: string;
    readonly resource: string;
    constructor(resourceName: string, http: HttpInterceptor, authService: AuthService, appConfig: AppConfigService, eventsManagerService: EventManagerService);
    list(config?: IListOptions, options?: any): Observable<any>;
    read(resourceId: string, config?: IListOptions): Observable<any>;
    save(resource: any, options?: any): Observable<any>;
    delete(resourceId: string, options?: any): Observable<any>;
    addParent(resource: any, type: string, parent: any, context?: string): any;
}
