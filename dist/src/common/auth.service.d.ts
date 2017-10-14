import { Http } from '@angular/http';
import { LocalStorageService } from './local-storage.service';
import { EventManagerService } from './event-manager.service';
export declare class AuthService {
    http: Http;
    localStorage: LocalStorageService;
    eventManager: EventManagerService;
    private cachedAppAccessToken;
    private cachedAccessToken;
    private cachedUser;
    constructor(http: Http, localStorage: LocalStorageService, eventManager: EventManagerService);
    setAccessToken(accessToken: string): void;
    setAppAccessToken(accessToken: string): void;
    getAccessToken(): string | null;
    getAppAccessToken(): string | null;
    getRefreshToken(): any;
    setUser(user: any): void;
    setRefreshToken(refreshToken: string): void;
    getUser(): any;
    isLoggedIn(): boolean;
    userHasRole(roles: string[] | string): boolean;
    logout(): void;
}
