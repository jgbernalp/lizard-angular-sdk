import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Subject } from 'rxjs/Subject';

import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';

@Injectable()
export class UsersService extends CRUDService {
    private localOnUserLogsIn: Subject<any> = new Subject();

    public get onUserLogsIn(): Observable<any> {
        return this.localOnUserLogsIn.asObservable();
    }

    constructor(public http: Http, public authService: AuthService) {
        super('users', http, authService);
    }

    public login(username: string, password: string): Observable<any> {
        return this.post('login', { username, password }, null, { credentials: false })
            .map((loginResponse) => {
                if (loginResponse && loginResponse.access_token) {
                    const accessToken = loginResponse.access_token;
                    this.authService.setAccessToken(accessToken);

                    this.localOnUserLogsIn.next();
                }

                return Observable.of(loginResponse);
            });
    }

    public logout() {
        this.authService.logout();
    }
}
