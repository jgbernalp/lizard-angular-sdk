import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {
    private cachedAccessToken: string;
    private cachedUser: any;

    constructor(public http: Http, public localStorage: LocalStorageService) {
    }

    public setAccessToken(accessToken: string) {
        this.localStorage.set('AT', accessToken);
        this.cachedAccessToken = accessToken;
    }

    public getAccessToken() {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('AT');
        }

        return this.cachedAccessToken;
    }

    public setUser(user: any) {
        this.localStorage.set('US', user);
    }

    public getUser(): any {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('US');
        }

        return this.cachedAccessToken;
    }

    public isLoggedIn() {
        return this.getUser() != null;
    }

    public logout() {
        this.localStorage.remove('AT');
        this.localStorage.remove('US');
    }
}
