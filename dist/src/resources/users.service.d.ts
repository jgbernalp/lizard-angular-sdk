import { HttpInterceptor } from '../common/http-interceptor.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';
import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';
export declare class UsersService extends CRUDService {
    http: HttpInterceptor;
    authService: AuthService;
    appConfig: AppConfigService;
    eventsManagerService: EventManagerService;
    constructor(http: HttpInterceptor, authService: AuthService, appConfig: AppConfigService, eventsManagerService: EventManagerService);
    register(data: any): Observable<any>;
    recoverPassword(username: string): Observable<any>;
    resetPassword(recoveryCode: string, password: string): Observable<any>;
    invite(email: string): Observable<any>;
    logout(): void;
}
