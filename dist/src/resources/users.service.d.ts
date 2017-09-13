import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';
import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';
export declare class UsersService extends CRUDService {
    http: Http;
    authService: AuthService;
    appConfig: AppConfigService;
    eventsManagerService: EventManagerService;
    constructor(http: Http, authService: AuthService, appConfig: AppConfigService, eventsManagerService: EventManagerService);
    register(data: any): Observable<any>;
    logout(): void;
}
