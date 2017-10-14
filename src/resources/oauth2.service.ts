import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpInterceptor } from '../common/http-interceptor.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';

import { Subject } from 'rxjs/Subject';

import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';

import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

@Injectable()
export class Oauth2Service extends CRUDService {
    constructor(
        public http: HttpInterceptor,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super('oauth2', http, authService, appConfig, eventsManagerService);
    }

    public init() {
        this.eventsManagerService.refreshToken.subscribe(() => {
            this.refreshToken(this.authService.getRefreshToken()).first().subscribe();
        });
    }

    public login(username: string, password: string): Observable<any> {
        return this.post(this.resource + '/token', {
            password,
            username,
            grant_type: 'password'
        }, null, { credentials: 'app' })
            .map((loginResponse) => {
                if (loginResponse && loginResponse.access_token) {
                    const accessToken = loginResponse.access_token;
                    this.authService.setAccessToken(accessToken);
                    this.authService.setUser(loginResponse.data.identity);

                    if (loginResponse.refresh_token) {
                        const refreshToken = loginResponse.refresh_token;
                        this.authService.setRefreshToken(refreshToken);
                    }

                    this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
                }

                return Observable.of(loginResponse);
            });
    }

    public appLogin(clientId?: string, clientSecret?: string): Observable<any> {
        if (!clientId) {
            clientId = this.appConfig.config.clientId;
        }

        if (!clientSecret) {
            clientSecret = this.appConfig.config.clientSecret;
        }

        return this.post(this.resource + '/token', {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        }, null, { credentials: false })
            .map((loginResponse) => {
                if (loginResponse && loginResponse.access_token) {
                    const accessToken = loginResponse.access_token;
                    this.authService.setAppAccessToken(accessToken);
                }

                return Observable.of(loginResponse);
            });
    }

    public refreshToken(refreshToken: string) {
        return this.post(this.resource + '/token', {
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }, null, { credentials: false })
            .map((refreshTokenResponse) => {
                if (refreshTokenResponse && refreshTokenResponse.refresh_token) {
                    const refreshToken = refreshTokenResponse.refresh_token;
                    const accessToken = refreshTokenResponse.access_token;

                    this.authService.setAccessToken(accessToken);
                    this.authService.setRefreshToken(refreshToken);

                    this.eventsManagerService.trigger(EventManagerService.ON_TOKEN_REFRESHED, { newAccessToken: accessToken, newRefreshToken: refreshToken });
                }

                return Observable.of(refreshTokenResponse);
            });
    }

    public logout() {
        this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_OUT);
        this.authService.logout();
    }
}
