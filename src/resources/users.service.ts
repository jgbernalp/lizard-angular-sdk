import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpInterceptor } from '../common/http-interceptor.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Subject } from 'rxjs/Subject';

import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';

import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

@Injectable()
export class UsersService extends CRUDService {
    constructor(public http: HttpInterceptor,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super('users', http, authService, appConfig, eventsManagerService);
    }

    public register(data: any): Observable<any> {
        return this.post(this.resource + '/register', data, null, { credentials: 'app' })
            .map((loginResponse) => {
                if (loginResponse && loginResponse.access_token) {
                    const accessToken = loginResponse.access_token;
                    this.authService.setAccessToken(accessToken);
                    this.authService.setUser(loginResponse.data.identity);

                    this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
                }

                return Observable.of(loginResponse);
            });
    }

    public recoverPassword(username: string): Observable<any> {
        return this.post(this.resource + '/password/recover', { username }, null, { credentials: 'app' });
    }

    public resetPassword(recoveryCode: string, password: string): Observable<any> {
        return this.post(this.resource + '/password/reset', { recoveryCode, password }, null, { credentials: 'app' });
    }

    public invite(email: string): Observable<any> {
        return this.post(this.resource + '/invite', { email });
    }

    public logout() {
        this.authService.logout();
    }
}
