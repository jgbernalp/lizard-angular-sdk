import { Injectable, NgModule } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';

class LocalStorageService {
    constructor() {
        this.prefix = 'lizard-';
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    set(key, value) {
        if (typeof value.toStorageItem === 'function') {
            value = value.toStorageItem();
        }
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }
    /**
     * @param {?} key
     * @return {?}
     */
    get(key) {
        const /** @type {?} */ value = localStorage.getItem(this.prefix + key);
        if (value != null) {
            return JSON.parse(value);
        }
        return null;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    remove(key) {
        localStorage.removeItem(key);
    }
}
LocalStorageService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
LocalStorageService.ctorParameters = () => [];

class AuthService {
    /**
     * @param {?} http
     * @param {?} localStorage
     */
    constructor(http, localStorage) {
        this.http = http;
        this.localStorage = localStorage;
    }
    /**
     * @param {?} accessToken
     * @return {?}
     */
    setAccessToken(accessToken) {
        this.localStorage.set('AT', accessToken);
        this.cachedAccessToken = accessToken;
    }
    /**
     * @return {?}
     */
    getAccessToken() {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('AT');
        }
        return this.cachedAccessToken;
    }
    /**
     * @param {?} user
     * @return {?}
     */
    setUser(user) {
        this.localStorage.set('US', user);
    }
    /**
     * @return {?}
     */
    getUser() {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('US');
        }
        return this.cachedAccessToken;
    }
    /**
     * @return {?}
     */
    isLoggedIn() {
        return this.getUser() != null;
    }
    /**
     * @return {?}
     */
    logout() {
        this.localStorage.remove('AT');
        this.localStorage.remove('US');
    }
}
AuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AuthService.ctorParameters = () => [
    { type: Http, },
    { type: LocalStorageService, },
];

class AppConfig {
    /**
     * @param {?} config
     * @return {?}
     */
    static setInitialConfig(config) {
        AppConfig.initialConfig = config;
    }
    /**
     * @return {?}
     */
    static get config() {
        return AppConfig.initialConfig;
    }
}

class APIService {
    /**
     * @param {?} http
     * @param {?} authService
     */
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
        this.apiURL = AppConfig.config.apiURL;
        this.clientId = AppConfig.config.clientId;
        this.clientSecret = AppConfig.config.clientSecret;
    }
    /**
     * @param {?} path
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    get(path, query, options) {
        return this.http.get(this.apiURL + '/' + path + this.getUrlParams(query), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }
    /**
     * @param {?} path
     * @param {?=} data
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    put(path, data, query, options) {
        return this.http.put(this.apiURL + '/' + path + this.getUrlParams(query), data, this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }
    /**
     * @param {?} path
     * @param {?=} data
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    post(path, data, query, options) {
        return this.http.post(this.apiURL + '/' + path +
            this.getUrlParams(query), data, this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }
    /**
     * @param {?} path
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    delete(path, query, options) {
        return this.http.delete(this.apiURL + '/' + path +
            this.getUrlParams(query), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    getRequestOptions(options) {
        const /** @type {?} */ headers = new Headers({ 'Content-Type': 'application/json' });
        const /** @type {?} */ requestOptions = new RequestOptions({ headers });
        if (!options || options.credentials === undefined || options.credentials === true) {
            headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
        }
        return requestOptions;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    getUrlParams(data) {
        let /** @type {?} */ urlParams = '';
        if (data) {
            const /** @type {?} */ params = [];
            const /** @type {?} */ keys = Object.keys(data);
            for (const /** @type {?} */ key of keys) {
                params.push(key + '=' + encodeURIComponent(data[key]));
            }
            if (params.length > 0) {
                urlParams = '?' + params.join('&');
            }
        }
        return urlParams;
    }
    /**
     * @param {?} res
     * @return {?}
     */
    extractData(res) {
        const /** @type {?} */ body = res.json();
        return body.data || {};
    }
    /**
     * @param {?} error
     * @return {?}
     */
    handleError(error) {
        // TODO use a remote logging infrastructure
        let /** @type {?} */ errMsg;
        if (error instanceof Response) {
            const /** @type {?} */ body = error.json() || '';
            const /** @type {?} */ err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
APIService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
APIService.ctorParameters = () => [
    { type: Http, },
    { type: AuthService, },
];

class CRUDService extends APIService {
    /**
     * @param {?} resourceName
     * @param {?} http
     * @param {?} authService
     */
    constructor(resourceName, http, authService) {
        super(http, authService);
        this.http = http;
        this.authService = authService;
        this.localResourceIdName = '_id';
        this.resourceName = resourceName;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set resourceIdName(value) {
        this.localResourceIdName = value;
    }
    /**
     * @return {?}
     */
    get resourceIdName() {
        return this.localResourceIdName;
    }
    /**
     * @param {?=} query
     * @param {?=} limit
     * @param {?=} fields
     * @param {?=} sort
     * @param {?=} options
     * @return {?}
     */
    list(query = {}, limit, fields, sort, options) {
        return this.get(this.resourceName, { query, fields, sort }, options);
    }
    /**
     * @param {?} resourceId
     * @param {?=} fields
     * @param {?=} options
     * @return {?}
     */
    read(resourceId, fields, options) {
        return this.get(this.resourceName + '/' + resourceId, { fields }, options);
    }
    /**
     * @param {?} resource
     * @param {?} data
     * @param {?} options
     * @return {?}
     */
    save(resource, data, options) {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], data, options);
        }
        else {
            return this.post(this.resourceName, data, options);
        }
    }
    /**
     * @param {?} resourceId
     * @param {?} options
     * @return {?}
     */
    delete(resourceId, options) {
        return super.delete(this.resourceName + '/' + resourceId, options);
    }
}
CRUDService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CRUDService.ctorParameters = () => [
    null,
    { type: Http, },
    { type: AuthService, },
];

class UsersService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     */
    constructor(http, authService) {
        super('users', http, authService);
        this.http = http;
        this.authService = authService;
        this.localOnUserLogsIn = new Subject();
    }
    /**
     * @return {?}
     */
    get onUserLogsIn() {
        return this.localOnUserLogsIn.asObservable();
    }
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    login(username, password) {
        return this.post('login', { username, password }, null, { credentials: false })
            .map((loginResponse) => {
            if (loginResponse && loginResponse.access_token) {
                const /** @type {?} */ accessToken = loginResponse.access_token;
                this.authService.setAccessToken(accessToken);
                this.localOnUserLogsIn.next();
            }
            return Observable.of(loginResponse);
        });
    }
    /**
     * @return {?}
     */
    logout() {
        this.authService.logout();
    }
}
UsersService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UsersService.ctorParameters = () => [
    { type: Http, },
    { type: AuthService, },
];

class LizardSDKModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        AppConfig.setInitialConfig(config);
        return {
            ngModule: LizardSDKModule,
            providers: [
                LocalStorageService,
                AuthService,
                APIService,
                UsersService
            ]
        };
    }
    /**
     * @return {?}
     */
    static forChild() {
        return {
            ngModule: LizardSDKModule,
            providers: [
                APIService,
                AuthService,
                APIService,
                UsersService
            ]
        };
    }
}
LizardSDKModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
LizardSDKModule.ctorParameters = () => [];

// Public classes.

/**
 * Entry point for all public APIs of the package.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { LocalStorageService, AuthService, APIService, UsersService, LizardSDKModule, CRUDService as ɵa };
//# sourceMappingURL=lizard-angular-sdk.js.map
