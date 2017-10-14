import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { LocalStorageService } from './local-storage.service';
import { EventManagerService } from './event-manager.service';

@Injectable()
export class AuthService {
    private cachedAppAccessToken: string | null;
    private cachedAccessToken: string | null;
    private cachedUser: any;

    constructor(
        public http: Http,
        public localStorage: LocalStorageService,
        public eventManager: EventManagerService
    ) { }

    public setAccessToken(accessToken: string) {
        this.localStorage.set('AT', accessToken);
        this.cachedAccessToken = accessToken;
    }

    public setAppAccessToken(accessToken: string) {
        this.localStorage.set('ATA', accessToken);
        this.cachedAppAccessToken = accessToken;
    }

    public getAccessToken() {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('AT');
        }

        return this.cachedAccessToken;
    }

    public getAppAccessToken() {
        if (!this.cachedAppAccessToken) {
            this.cachedAppAccessToken = this.localStorage.get('ATA');
        }

        return this.cachedAppAccessToken;
    }

    public getRefreshToken() {
        return this.localStorage.get('RT');
    }

    public setUser(user: any) {
        this.cachedUser = user;
        this.localStorage.set('US', user);

        this.eventManager.trigger(EventManagerService.ON_USER_CHANGED, user);
    }

    public setRefreshToken(refreshToken: string) {
        this.localStorage.set('RT', refreshToken);

        this.eventManager.trigger(EventManagerService.ON_TOKEN_REFRESHED, refreshToken);
    }

    public getUser(): any {
        if (!this.cachedUser) {
            this.cachedUser = this.localStorage.get('US');
        }

        return this.cachedUser;
    }

    public isLoggedIn() {
        return this.getUser() != null;
    }

    public userHasRole(roles: string[] | string) {
        const user = this.getUser();

        if (Array.isArray(roles)) {
            for (let role of roles) {
                if (user.roles.indexOf(role) >= 0) {
                    return true;
                }
            }
        } else {
            if (user.roles.indexOf(roles) >= 0) {
                return true;
            }
        }

        return false;
    }

    public logout() {
        this.cachedAccessToken = null;
        this.cachedUser = null;
        this.localStorage.remove('AT');
        this.localStorage.remove('RT');
        this.localStorage.remove('US');
    }
}
