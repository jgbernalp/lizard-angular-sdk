import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';
export declare class UsersService extends CRUDService {
    http: Http;
    authService: AuthService;
    private localOnUserLogsIn;
    readonly onUserLogsIn: Observable<any>;
    constructor(http: Http, authService: AuthService);
    login(username: string, password: string): Observable<any>;
    logout(): void;
}
