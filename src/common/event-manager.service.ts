import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventManagerService {
    public static ON_USER_SIGN_OUT: string = '_onUserSignOut';
    public static ON_USER_SIGN_IN: string = '_onUserSignIn';
    public static ON_USER_CHANGED: string = '_onUserChanged';
    public static ON_TOKEN_REFRESHED: string = '_onTokenRefreshed';
    public static REFRESH_TOKEN: string = '_refreshToken';

    private events: { [key: string]: Subject<any> } = {
        '_onUserSignOut': new Subject(),
        '_onUserSignIn': new Subject(),
        '_onUserChanged': new Subject(),
        '_onTokenRefreshed': new Subject(),
        '_refreshToken': new Subject()
    }

    public get onUserSignIn(): Observable<any> {
        return this.events['_onUserSignIn'].asObservable();
    }

    public get onUserSignOut(): Observable<any> {
        return this.events['_onUserSignOut'].asObservable();
    }

    public get onUserChanged(): Observable<any> {
        return this.events['_onUserChanged'].asObservable();
    }

    public get onTokenRefreshed(): Observable<any> {
        return this.events['_onTokenRefreshed'].asObservable();
    }

    public get refreshToken(): Observable<any> {
        return this.events['_refreshToken'].asObservable();
    }

    public trigger(event: string, data?: any) {
        if (this.events[event] && this.events[event] instanceof Subject) {
            this.events[event].next(data || {});
        }
    }
}
