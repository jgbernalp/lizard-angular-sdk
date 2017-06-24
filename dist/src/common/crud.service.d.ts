import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { APIService } from './api.service';
import { AuthService } from './auth.service';
export declare class CRUDService extends APIService {
    http: Http;
    authService: AuthService;
    private resourceName;
    private localResourceIdName;
    resourceIdName: string;
    constructor(resourceName: string, http: Http, authService: AuthService);
    list(query?: any, limit?: number, fields?: [string], sort?: [string], options?: any): Observable<any>;
    read(resourceId: string, fields?: [string], options?: any): Observable<any>;
    save(resource: any, data: any, options: any): Observable<any>;
    delete(resourceId: string, options: any): Observable<any>;
}
