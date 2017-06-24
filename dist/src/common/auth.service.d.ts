import { Http } from '@angular/http';
import { LocalStorageService } from './local-storage.service';
export declare class AuthService {
    http: Http;
    localStorage: LocalStorageService;
    private cachedAccessToken;
    private cachedUser;
    constructor(http: Http, localStorage: LocalStorageService);
    setAccessToken(accessToken: string): void;
    getAccessToken(): string;
    setUser(user: any): void;
    getUser(): any;
    isLoggedIn(): boolean;
    logout(): void;
}
