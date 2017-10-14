import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Headers, Http, Request, RequestOptions, Response, XHRBackend } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';

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
        localStorage.removeItem(this.prefix + key);
    }
}
LocalStorageService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
LocalStorageService.ctorParameters = () => [];

class EventManagerService {
    constructor() {
        this.events = {
            '_onUserSignOut': new Subject(),
            '_onUserSignIn': new Subject(),
            '_onUserChanged': new Subject(),
            '_onTokenRefreshed': new Subject(),
            '_refreshToken': new Subject()
        };
    }
    /**
     * @return {?}
     */
    get onUserSignIn() {
        return this.events['_onUserSignIn'].asObservable();
    }
    /**
     * @return {?}
     */
    get onUserSignOut() {
        return this.events['_onUserSignOut'].asObservable();
    }
    /**
     * @return {?}
     */
    get onUserChanged() {
        return this.events['_onUserChanged'].asObservable();
    }
    /**
     * @return {?}
     */
    get onTokenRefreshed() {
        return this.events['_onTokenRefreshed'].asObservable();
    }
    /**
     * @return {?}
     */
    get refreshToken() {
        return this.events['_refreshToken'].asObservable();
    }
    /**
     * @param {?} event
     * @param {?=} data
     * @return {?}
     */
    trigger(event, data) {
        if (this.events[event] && this.events[event] instanceof Subject) {
            this.events[event].next(data || {});
        }
    }
}
EventManagerService.ON_USER_SIGN_OUT = '_onUserSignOut';
EventManagerService.ON_USER_SIGN_IN = '_onUserSignIn';
EventManagerService.ON_USER_CHANGED = '_onUserChanged';
EventManagerService.ON_TOKEN_REFRESHED = '_onTokenRefreshed';
EventManagerService.REFRESH_TOKEN = '_refreshToken';
EventManagerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
EventManagerService.ctorParameters = () => [];

class AuthService {
    /**
     * @param {?} http
     * @param {?} localStorage
     * @param {?} eventManager
     */
    constructor(http, localStorage, eventManager) {
        this.http = http;
        this.localStorage = localStorage;
        this.eventManager = eventManager;
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
     * @param {?} accessToken
     * @return {?}
     */
    setAppAccessToken(accessToken) {
        this.localStorage.set('ATA', accessToken);
        this.cachedAppAccessToken = accessToken;
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
     * @return {?}
     */
    getAppAccessToken() {
        if (!this.cachedAppAccessToken) {
            this.cachedAppAccessToken = this.localStorage.get('ATA');
        }
        return this.cachedAppAccessToken;
    }
    /**
     * @return {?}
     */
    getRefreshToken() {
        return this.localStorage.get('RT');
    }
    /**
     * @param {?} user
     * @return {?}
     */
    setUser(user) {
        this.cachedUser = user;
        this.localStorage.set('US', user);
        this.eventManager.trigger(EventManagerService.ON_USER_CHANGED, user);
    }
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    setRefreshToken(refreshToken) {
        this.localStorage.set('RT', refreshToken);
        this.eventManager.trigger(EventManagerService.ON_TOKEN_REFRESHED, refreshToken);
    }
    /**
     * @return {?}
     */
    getUser() {
        if (!this.cachedUser) {
            this.cachedUser = this.localStorage.get('US');
        }
        return this.cachedUser;
    }
    /**
     * @return {?}
     */
    isLoggedIn() {
        return this.getUser() != null;
    }
    /**
     * @param {?} roles
     * @return {?}
     */
    userHasRole(roles) {
        const /** @type {?} */ user = this.getUser();
        if (Array.isArray(roles)) {
            for (let /** @type {?} */ role of roles) {
                if (user.roles.indexOf(role) >= 0) {
                    return true;
                }
            }
        }
        else {
            if (user.roles.indexOf(roles) >= 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    logout() {
        this.cachedAccessToken = null;
        this.cachedUser = null;
        this.localStorage.remove('AT');
        this.localStorage.remove('RT');
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
    { type: EventManagerService, },
];

class HttpInterceptor extends Http {
    /**
     * @param {?} backend
     * @param {?} options
     * @param {?} eventManager
     */
    constructor(backend, options, eventManager) {
        super(backend, options);
        this.eventManager = eventManager;
        this.notifier = new Subject();
        this.refreshingToken = false;
        this.eventManager.onTokenRefreshed.subscribe(({ newAccessToken }) => {
            this.refreshingToken = false;
            this.notifier.next(newAccessToken);
        });
    }
    /**
     * @param {?} headers
     * @param {?} newAccessToken
     * @return {?}
     */
    getNewHeaders(headers, newAccessToken) {
        headers.set('authorization', newAccessToken);
        return headers;
    }
    /**
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    request(url, options) {
        const /** @type {?} */ requestUrl = (url);
        if (requestUrl.url.indexOf('oauth2/token') >= 0) {
            return super.request(url, options);
        }
        else if (this.refreshingToken) {
            return this.notifier.asObservable().flatMap(() => {
                return super.request(url, options);
            });
        }
        else {
            return super.request(url, options).catch((error) => {
                if (error && error.status == 401) {
                    const /** @type {?} */ body = JSON.parse(error._body);
                    if (body && body.error && body.error.code == 100) {
                        this.refreshingToken = true;
                        this.eventManager.trigger(EventManagerService.REFRESH_TOKEN);
                        return this.notifier.asObservable().flatMap((newAccessToken) => {
                            const /** @type {?} */ newRequest = new Request({
                                headers: this.getNewHeaders(requestUrl.headers, newAccessToken),
                                url: requestUrl.url,
                                body: requestUrl.getBody(),
                                method: requestUrl.method,
                                responseType: requestUrl.responseType
                            });
                            return super.request(newRequest, options);
                        });
                    }
                    else {
                        return Observable.throw(error);
                    }
                }
                return Observable.throw(error);
            });
        }
    }
}
HttpInterceptor.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
HttpInterceptor.ctorParameters = () => [
    { type: XHRBackend, },
    { type: RequestOptions, },
    { type: EventManagerService, },
];

let INITIAL_CONFIG = new InjectionToken('app.config');

class AppConfigService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.initialConfig = config;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    setInitialConfig(config) {
        this.initialConfig = config;
    }
    /**
     * @return {?}
     */
    get config() {
        return this.initialConfig;
    }
}
/**
 * @nocollapse
 */
AppConfigService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_CONFIG,] },] },
];

class APIService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
        this.apiURL = this.appConfig.config.apiURL;
        this.clientId = this.appConfig.config.clientId;
        this.clientSecret = this.appConfig.config.clientSecret;
    }
    /**
     * @param {?} path
     * @param {?=} config
     * @param {?=} options
     * @return {?}
     */
    get(path, config, options) {
        return this.http.get(this.apiURL + '/' + path + this.getUrlParams(config), this.getRequestOptions(options))
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
        if (!options || options.credentials === undefined || options.credentials === true ||
            options.credentials === 'app') {
            if (options !== undefined && options.credentials === 'app') {
                headers.append('Authorization', 'Bearer ' + this.authService.getAppAccessToken());
            }
            else {
                headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
            }
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
                if (data[key] !== undefined && String(data[key]).length > 0) {
                    let /** @type {?} */ keyValue = data[key];
                    if (typeof keyValue === 'object') {
                        try {
                            keyValue = JSON.stringify(keyValue);
                        }
                        catch (err) {
                            // do nothing
                        }
                    }
                    params.push(key + '=' + encodeURIComponent(keyValue));
                }
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
        return res.json();
    }
    /**
     * @param {?} error
     * @return {?}
     */
    handleError(error) {
        // TODO use a remote logging infrastructure
        let /** @type {?} */ errObj;
        if (error instanceof Response) {
            const /** @type {?} */ body = error.json() || '';
            const /** @type {?} */ err = body.error || JSON.stringify(body);
            errObj = err;
        }
        else {
            errObj = error;
        }
        return Observable.throw(errObj);
    }
}
APIService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
APIService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class CRUDService extends APIService {
    /**
     * @param {?} resourceName
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(resourceName, http, authService, appConfig, eventsManagerService) {
        super(http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
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
     * @return {?}
     */
    get resource() {
        return this.resourceName;
    }
    /**
     * @param {?=} config
     * @param {?=} options
     * @return {?}
     */
    list(config, options) {
        return this.get(this.resourceName, config, options);
    }
    /**
     * @param {?} resourceId
     * @param {?=} config
     * @return {?}
     */
    read(resourceId, config = {}) {
        const { fields, options } = config;
        return this.get(this.resourceName + '/' + resourceId, { fields }, options);
    }
    /**
     * @param {?} resource
     * @param {?=} options
     * @return {?}
     */
    save(resource, options) {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], resource, options);
        }
        else {
            return this.post(this.resourceName, resource, options);
        }
    }
    /**
     * @param {?} resourceId
     * @param {?=} options
     * @return {?}
     */
    delete(resourceId, options) {
        return super.delete(this.resourceName + '/' + resourceId, options);
    }
    /**
     * @param {?} resource
     * @param {?} type
     * @param {?} parent
     * @param {?=} context
     * @return {?}
     */
    addParent(resource, type, parent, context) {
        let /** @type {?} */ existingParentIndex = -1;
        if (!resource.parents) {
            resource.parents = [];
        }
        else {
            existingParentIndex = resource.parents.findIndex((item) => {
                if (context) {
                    return item.id == parent._id && item.type == type && item.context == context;
                }
                else {
                    return item.id == parent._id && item.type == type;
                }
            });
        }
        if (!parent || !parent._id) {
            throw new Error('Invalid parent or parent.id when adding');
        }
        let /** @type {?} */ parentObject = { id: parent._id, type, name: parent.name };
        if (context) {
            parentObject.context = context;
        }
        if (existingParentIndex >= 0) {
            resource.parents[existingParentIndex] = parentObject;
        }
        else {
            resource.parents.push(parentObject);
        }
        return resource;
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
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class UsersService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('users', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    register(data) {
        return this.post(this.resource + '/register', data, null, { credentials: 'app' })
            .map((loginResponse) => {
            if (loginResponse && loginResponse.access_token) {
                const /** @type {?} */ accessToken = loginResponse.access_token;
                this.authService.setAccessToken(accessToken);
                this.authService.setUser(loginResponse.data.identity);
                this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
            }
            return Observable.of(loginResponse);
        });
    }
    /**
     * @param {?} username
     * @return {?}
     */
    recoverPassword(username) {
        return this.post(this.resource + '/password/recover', { username }, null, { credentials: 'app' });
    }
    /**
     * @param {?} recoveryCode
     * @param {?} password
     * @return {?}
     */
    resetPassword(recoveryCode, password) {
        return this.post(this.resource + '/password/reset', { recoveryCode, password }, null, { credentials: 'app' });
    }
    /**
     * @param {?} email
     * @return {?}
     */
    invite(email) {
        return this.post(this.resource + '/invite', { email });
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
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class Oauth2Service extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('oauth2', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
    /**
     * @return {?}
     */
    init() {
        this.eventsManagerService.refreshToken.subscribe(() => {
            this.refreshToken(this.authService.getRefreshToken()).first().subscribe();
        });
    }
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    login(username, password) {
        return this.post(this.resource + '/token', {
            password,
            username,
            grant_type: 'password'
        }, null, { credentials: 'app' })
            .map((loginResponse) => {
            if (loginResponse && loginResponse.access_token) {
                const /** @type {?} */ accessToken = loginResponse.access_token;
                this.authService.setAccessToken(accessToken);
                this.authService.setUser(loginResponse.data.identity);
                if (loginResponse.refresh_token) {
                    const /** @type {?} */ refreshToken = loginResponse.refresh_token;
                    this.authService.setRefreshToken(refreshToken);
                }
                this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
            }
            return Observable.of(loginResponse);
        });
    }
    /**
     * @param {?=} clientId
     * @param {?=} clientSecret
     * @return {?}
     */
    appLogin(clientId, clientSecret) {
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
                const /** @type {?} */ accessToken = loginResponse.access_token;
                this.authService.setAppAccessToken(accessToken);
            }
            return Observable.of(loginResponse);
        });
    }
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    refreshToken(refreshToken) {
        return this.post(this.resource + '/token', {
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }, null, { credentials: false })
            .map((refreshTokenResponse) => {
            if (refreshTokenResponse && refreshTokenResponse.refresh_token) {
                const /** @type {?} */ refreshToken = refreshTokenResponse.refresh_token;
                const /** @type {?} */ accessToken = refreshTokenResponse.access_token;
                this.authService.setAccessToken(accessToken);
                this.authService.setRefreshToken(refreshToken);
                this.eventsManagerService.trigger(EventManagerService.ON_TOKEN_REFRESHED, { newAccessToken: accessToken, newRefreshToken: refreshToken });
            }
            return Observable.of(refreshTokenResponse);
        });
    }
    /**
     * @return {?}
     */
    logout() {
        this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_OUT);
        this.authService.logout();
    }
}
Oauth2Service.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Oauth2Service.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class CompaniesService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('companies', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
}
CompaniesService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CompaniesService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class OrdersService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('orders', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
}
OrdersService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OrdersService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class GeoLocationService extends APIService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super(http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
    /**
     * @param {?} lat
     * @param {?} lng
     * @return {?}
     */
    getAddressFromLocation(lat, lng) {
        return this.get('geolocation/address-from-location', { query: { lat, lng } });
    }
    /**
     * @param {?} address
     * @return {?}
     */
    getLocationFromAddress(address) {
        return this.get('geolocation/location-from-address', { query: { address } });
    }
}
GeoLocationService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GeoLocationService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class ServicesService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('services', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
}
ServicesService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ServicesService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class ConfigurationsService extends CRUDService {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    constructor(http, authService, appConfig, eventsManagerService) {
        super('configurations', http, authService, appConfig, eventsManagerService);
        this.http = http;
        this.authService = authService;
        this.appConfig = appConfig;
        this.eventsManagerService = eventsManagerService;
    }
}
ConfigurationsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ConfigurationsService.ctorParameters = () => [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
];

class LizardSDKModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: LizardSDKModule,
            providers: [
                {
                    provide: INITIAL_CONFIG,
                    useValue: config
                },
                LocalStorageService,
                AuthService,
                APIService,
                AppConfigService,
                EventManagerService,
                HttpInterceptor,
                UsersService,
                Oauth2Service,
                CompaniesService,
                OrdersService,
                GeoLocationService,
                ServicesService,
                ConfigurationsService
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
                AppConfigService,
                EventManagerService,
                HttpInterceptor,
                UsersService,
                Oauth2Service,
                CompaniesService,
                OrdersService,
                GeoLocationService,
                ServicesService,
                ConfigurationsService
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

export { LocalStorageService, AuthService, APIService, CRUDService, UsersService, Oauth2Service, CompaniesService, OrdersService, GeoLocationService, ServicesService, ConfigurationsService, EventManagerService, AppConfigService, LizardSDKModule, HttpInterceptor as ɵa, INITIAL_CONFIG as ɵb };
//# sourceMappingURL=lizard-angular-sdk.js.map
