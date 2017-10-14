var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var LocalStorageService = (function () {
    function LocalStorageService() {
        this.prefix = 'lizard-';
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    LocalStorageService.prototype.set = function (key, value) {
        if (typeof value.toStorageItem === 'function') {
            value = value.toStorageItem();
        }
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    };
    /**
     * @param {?} key
     * @return {?}
     */
    LocalStorageService.prototype.get = function (key) {
        var /** @type {?} */ value = localStorage.getItem(this.prefix + key);
        if (value != null) {
            return JSON.parse(value);
        }
        return null;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    LocalStorageService.prototype.remove = function (key) {
        localStorage.removeItem(this.prefix + key);
    };
    return LocalStorageService;
}());
LocalStorageService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
LocalStorageService.ctorParameters = function () { return []; };
var EventManagerService = (function () {
    function EventManagerService() {
        this.events = {
            '_onUserSignOut': new Subject(),
            '_onUserSignIn': new Subject(),
            '_onUserChanged': new Subject(),
            '_onTokenRefreshed': new Subject(),
            '_refreshToken': new Subject()
        };
    }
    Object.defineProperty(EventManagerService.prototype, "onUserSignIn", {
        /**
         * @return {?}
         */
        get: function () {
            return this.events['_onUserSignIn'].asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventManagerService.prototype, "onUserSignOut", {
        /**
         * @return {?}
         */
        get: function () {
            return this.events['_onUserSignOut'].asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventManagerService.prototype, "onUserChanged", {
        /**
         * @return {?}
         */
        get: function () {
            return this.events['_onUserChanged'].asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventManagerService.prototype, "onTokenRefreshed", {
        /**
         * @return {?}
         */
        get: function () {
            return this.events['_onTokenRefreshed'].asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventManagerService.prototype, "refreshToken", {
        /**
         * @return {?}
         */
        get: function () {
            return this.events['_refreshToken'].asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @param {?=} data
     * @return {?}
     */
    EventManagerService.prototype.trigger = function (event, data) {
        if (this.events[event] && this.events[event] instanceof Subject) {
            this.events[event].next(data || {});
        }
    };
    return EventManagerService;
}());
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
EventManagerService.ctorParameters = function () { return []; };
var AuthService = (function () {
    /**
     * @param {?} http
     * @param {?} localStorage
     * @param {?} eventManager
     */
    function AuthService(http, localStorage, eventManager) {
        this.http = http;
        this.localStorage = localStorage;
        this.eventManager = eventManager;
    }
    /**
     * @param {?} accessToken
     * @return {?}
     */
    AuthService.prototype.setAccessToken = function (accessToken) {
        this.localStorage.set('AT', accessToken);
        this.cachedAccessToken = accessToken;
    };
    /**
     * @param {?} accessToken
     * @return {?}
     */
    AuthService.prototype.setAppAccessToken = function (accessToken) {
        this.localStorage.set('ATA', accessToken);
        this.cachedAppAccessToken = accessToken;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getAccessToken = function () {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('AT');
        }
        return this.cachedAccessToken;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getAppAccessToken = function () {
        if (!this.cachedAppAccessToken) {
            this.cachedAppAccessToken = this.localStorage.get('ATA');
        }
        return this.cachedAppAccessToken;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getRefreshToken = function () {
        return this.localStorage.get('RT');
    };
    /**
     * @param {?} user
     * @return {?}
     */
    AuthService.prototype.setUser = function (user) {
        this.cachedUser = user;
        this.localStorage.set('US', user);
        this.eventManager.trigger(EventManagerService.ON_USER_CHANGED, user);
    };
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    AuthService.prototype.setRefreshToken = function (refreshToken) {
        this.localStorage.set('RT', refreshToken);
        this.eventManager.trigger(EventManagerService.ON_TOKEN_REFRESHED, refreshToken);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getUser = function () {
        if (!this.cachedUser) {
            this.cachedUser = this.localStorage.get('US');
        }
        return this.cachedUser;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.isLoggedIn = function () {
        return this.getUser() != null;
    };
    /**
     * @param {?} roles
     * @return {?}
     */
    AuthService.prototype.userHasRole = function (roles) {
        var /** @type {?} */ user = this.getUser();
        if (Array.isArray(roles)) {
            for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
                var role = roles_1[_i];
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
    };
    /**
     * @return {?}
     */
    AuthService.prototype.logout = function () {
        this.cachedAccessToken = null;
        this.cachedUser = null;
        this.localStorage.remove('AT');
        this.localStorage.remove('RT');
        this.localStorage.remove('US');
    };
    return AuthService;
}());
AuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AuthService.ctorParameters = function () { return [
    { type: Http, },
    { type: LocalStorageService, },
    { type: EventManagerService, },
]; };
var HttpInterceptor = (function (_super) {
    __extends(HttpInterceptor, _super);
    /**
     * @param {?} backend
     * @param {?} options
     * @param {?} eventManager
     */
    function HttpInterceptor(backend, options, eventManager) {
        var _this = _super.call(this, backend, options) || this;
        _this.eventManager = eventManager;
        _this.notifier = new Subject();
        _this.refreshingToken = false;
        _this.eventManager.onTokenRefreshed.subscribe(function (_a) {
            var newAccessToken = _a.newAccessToken;
            _this.refreshingToken = false;
            _this.notifier.next(newAccessToken);
        });
        return _this;
    }
    /**
     * @param {?} headers
     * @param {?} newAccessToken
     * @return {?}
     */
    HttpInterceptor.prototype.getNewHeaders = function (headers, newAccessToken) {
        headers.set('authorization', newAccessToken);
        return headers;
    };
    /**
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    HttpInterceptor.prototype.request = function (url, options) {
        var _this = this;
        var /** @type {?} */ requestUrl = (url);
        if (requestUrl.url.indexOf('oauth2/token') >= 0) {
            return _super.prototype.request.call(this, url, options);
        }
        else if (this.refreshingToken) {
            return this.notifier.asObservable().flatMap(function () {
                return _super.prototype.request.call(_this, url, options);
            });
        }
        else {
            return _super.prototype.request.call(this, url, options).catch(function (error) {
                if (error && error.status == 401) {
                    var /** @type {?} */ body = JSON.parse(error._body);
                    if (body && body.error && body.error.code == 100) {
                        _this.refreshingToken = true;
                        _this.eventManager.trigger(EventManagerService.REFRESH_TOKEN);
                        return _this.notifier.asObservable().flatMap(function (newAccessToken) {
                            var /** @type {?} */ newRequest = new Request({
                                headers: _this.getNewHeaders(requestUrl.headers, newAccessToken),
                                url: requestUrl.url,
                                body: requestUrl.getBody(),
                                method: requestUrl.method,
                                responseType: requestUrl.responseType
                            });
                            return _super.prototype.request.call(_this, newRequest, options);
                        });
                    }
                    else {
                        return Observable.throw(error);
                    }
                }
                return Observable.throw(error);
            });
        }
    };
    return HttpInterceptor;
}(Http));
HttpInterceptor.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
HttpInterceptor.ctorParameters = function () { return [
    { type: XHRBackend, },
    { type: RequestOptions, },
    { type: EventManagerService, },
]; };
var INITIAL_CONFIG = new InjectionToken('app.config');
var AppConfigService = (function () {
    /**
     * @param {?} config
     */
    function AppConfigService(config) {
        this.initialConfig = config;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    AppConfigService.prototype.setInitialConfig = function (config) {
        this.initialConfig = config;
    };
    Object.defineProperty(AppConfigService.prototype, "config", {
        /**
         * @return {?}
         */
        get: function () {
            return this.initialConfig;
        },
        enumerable: true,
        configurable: true
    });
    return AppConfigService;
}());
/**
 * @nocollapse
 */
AppConfigService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_CONFIG,] },] },
]; };
var APIService = (function () {
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function APIService(http, authService, appConfig, eventsManagerService) {
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
    APIService.prototype.get = function (path, config, options) {
        return this.http.get(this.apiURL + '/' + path + this.getUrlParams(config), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * @param {?} path
     * @param {?=} data
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    APIService.prototype.put = function (path, data, query, options) {
        return this.http.put(this.apiURL + '/' + path + this.getUrlParams(query), data, this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * @param {?} path
     * @param {?=} data
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    APIService.prototype.post = function (path, data, query, options) {
        return this.http.post(this.apiURL + '/' + path +
            this.getUrlParams(query), data, this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * @param {?} path
     * @param {?=} query
     * @param {?=} options
     * @return {?}
     */
    APIService.prototype.delete = function (path, query, options) {
        return this.http.delete(this.apiURL + '/' + path +
            this.getUrlParams(query), this.getRequestOptions(options))
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    APIService.prototype.getRequestOptions = function (options) {
        var /** @type {?} */ headers = new Headers({ 'Content-Type': 'application/json' });
        var /** @type {?} */ requestOptions = new RequestOptions({ headers: headers });
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
    };
    /**
     * @param {?} data
     * @return {?}
     */
    APIService.prototype.getUrlParams = function (data) {
        var /** @type {?} */ urlParams = '';
        if (data) {
            var /** @type {?} */ params = [];
            var /** @type {?} */ keys = Object.keys(data);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (data[key] !== undefined && String(data[key]).length > 0) {
                    var /** @type {?} */ keyValue = data[key];
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
    };
    /**
     * @param {?} res
     * @return {?}
     */
    APIService.prototype.extractData = function (res) {
        return res.json();
    };
    /**
     * @param {?} error
     * @return {?}
     */
    APIService.prototype.handleError = function (error) {
        // TODO use a remote logging infrastructure
        var /** @type {?} */ errObj;
        if (error instanceof Response) {
            var /** @type {?} */ body = error.json() || '';
            var /** @type {?} */ err = body.error || JSON.stringify(body);
            errObj = err;
        }
        else {
            errObj = error;
        }
        return Observable.throw(errObj);
    };
    return APIService;
}());
APIService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
APIService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var CRUDService = (function (_super) {
    __extends(CRUDService, _super);
    /**
     * @param {?} resourceName
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function CRUDService(resourceName, http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        _this.localResourceIdName = '_id';
        _this.resourceName = resourceName;
        return _this;
    }
    Object.defineProperty(CRUDService.prototype, "resourceIdName", {
        /**
         * @return {?}
         */
        get: function () {
            return this.localResourceIdName;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.localResourceIdName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CRUDService.prototype, "resource", {
        /**
         * @return {?}
         */
        get: function () {
            return this.resourceName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?=} config
     * @param {?=} options
     * @return {?}
     */
    CRUDService.prototype.list = function (config, options) {
        return this.get(this.resourceName, config, options);
    };
    /**
     * @param {?} resourceId
     * @param {?=} config
     * @return {?}
     */
    CRUDService.prototype.read = function (resourceId, config) {
        if (config === void 0) { config = {}; }
        var fields = config.fields, options = config.options;
        return this.get(this.resourceName + '/' + resourceId, { fields: fields }, options);
    };
    /**
     * @param {?} resource
     * @param {?=} options
     * @return {?}
     */
    CRUDService.prototype.save = function (resource, options) {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], resource, options);
        }
        else {
            return this.post(this.resourceName, resource, options);
        }
    };
    /**
     * @param {?} resourceId
     * @param {?=} options
     * @return {?}
     */
    CRUDService.prototype.delete = function (resourceId, options) {
        return _super.prototype.delete.call(this, this.resourceName + '/' + resourceId, options);
    };
    /**
     * @param {?} resource
     * @param {?} type
     * @param {?} parent
     * @param {?=} context
     * @return {?}
     */
    CRUDService.prototype.addParent = function (resource, type, parent, context) {
        var /** @type {?} */ existingParentIndex = -1;
        if (!resource.parents) {
            resource.parents = [];
        }
        else {
            existingParentIndex = resource.parents.findIndex(function (item) {
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
        var /** @type {?} */ parentObject = { id: parent._id, type: type, name: parent.name };
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
    };
    return CRUDService;
}(APIService));
CRUDService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CRUDService.ctorParameters = function () { return [
    null,
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var UsersService = (function (_super) {
    __extends(UsersService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function UsersService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'users', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    UsersService.prototype.register = function (data) {
        var _this = this;
        return this.post(this.resource + '/register', data, null, { credentials: 'app' })
            .map(function (loginResponse) {
            if (loginResponse && loginResponse.access_token) {
                var /** @type {?} */ accessToken = loginResponse.access_token;
                _this.authService.setAccessToken(accessToken);
                _this.authService.setUser(loginResponse.data.identity);
                _this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
            }
            return Observable.of(loginResponse);
        });
    };
    /**
     * @param {?} username
     * @return {?}
     */
    UsersService.prototype.recoverPassword = function (username) {
        return this.post(this.resource + '/password/recover', { username: username }, null, { credentials: 'app' });
    };
    /**
     * @param {?} recoveryCode
     * @param {?} password
     * @return {?}
     */
    UsersService.prototype.resetPassword = function (recoveryCode, password) {
        return this.post(this.resource + '/password/reset', { recoveryCode: recoveryCode, password: password }, null, { credentials: 'app' });
    };
    /**
     * @param {?} email
     * @return {?}
     */
    UsersService.prototype.invite = function (email) {
        return this.post(this.resource + '/invite', { email: email });
    };
    /**
     * @return {?}
     */
    UsersService.prototype.logout = function () {
        this.authService.logout();
    };
    return UsersService;
}(CRUDService));
UsersService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UsersService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var Oauth2Service = (function (_super) {
    __extends(Oauth2Service, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function Oauth2Service(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'oauth2', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    /**
     * @return {?}
     */
    Oauth2Service.prototype.init = function () {
        var _this = this;
        this.eventsManagerService.refreshToken.subscribe(function () {
            _this.refreshToken(_this.authService.getRefreshToken()).first().subscribe();
        });
    };
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    Oauth2Service.prototype.login = function (username, password) {
        var _this = this;
        return this.post(this.resource + '/token', {
            password: password,
            username: username,
            grant_type: 'password'
        }, null, { credentials: 'app' })
            .map(function (loginResponse) {
            if (loginResponse && loginResponse.access_token) {
                var /** @type {?} */ accessToken = loginResponse.access_token;
                _this.authService.setAccessToken(accessToken);
                _this.authService.setUser(loginResponse.data.identity);
                if (loginResponse.refresh_token) {
                    var /** @type {?} */ refreshToken = loginResponse.refresh_token;
                    _this.authService.setRefreshToken(refreshToken);
                }
                _this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_IN);
            }
            return Observable.of(loginResponse);
        });
    };
    /**
     * @param {?=} clientId
     * @param {?=} clientSecret
     * @return {?}
     */
    Oauth2Service.prototype.appLogin = function (clientId, clientSecret) {
        var _this = this;
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
            .map(function (loginResponse) {
            if (loginResponse && loginResponse.access_token) {
                var /** @type {?} */ accessToken = loginResponse.access_token;
                _this.authService.setAppAccessToken(accessToken);
            }
            return Observable.of(loginResponse);
        });
    };
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    Oauth2Service.prototype.refreshToken = function (refreshToken) {
        var _this = this;
        return this.post(this.resource + '/token', {
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }, null, { credentials: false })
            .map(function (refreshTokenResponse) {
            if (refreshTokenResponse && refreshTokenResponse.refresh_token) {
                var /** @type {?} */ refreshToken_1 = refreshTokenResponse.refresh_token;
                var /** @type {?} */ accessToken = refreshTokenResponse.access_token;
                _this.authService.setAccessToken(accessToken);
                _this.authService.setRefreshToken(refreshToken_1);
                _this.eventsManagerService.trigger(EventManagerService.ON_TOKEN_REFRESHED, { newAccessToken: accessToken, newRefreshToken: refreshToken_1 });
            }
            return Observable.of(refreshTokenResponse);
        });
    };
    /**
     * @return {?}
     */
    Oauth2Service.prototype.logout = function () {
        this.eventsManagerService.trigger(EventManagerService.ON_USER_SIGN_OUT);
        this.authService.logout();
    };
    return Oauth2Service;
}(CRUDService));
Oauth2Service.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Oauth2Service.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var CompaniesService = (function (_super) {
    __extends(CompaniesService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function CompaniesService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'companies', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    return CompaniesService;
}(CRUDService));
CompaniesService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CompaniesService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var OrdersService = (function (_super) {
    __extends(OrdersService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function OrdersService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'orders', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    return OrdersService;
}(CRUDService));
OrdersService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OrdersService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var GeoLocationService = (function (_super) {
    __extends(GeoLocationService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function GeoLocationService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    /**
     * @param {?} lat
     * @param {?} lng
     * @return {?}
     */
    GeoLocationService.prototype.getAddressFromLocation = function (lat, lng) {
        return this.get('geolocation/address-from-location', { query: { lat: lat, lng: lng } });
    };
    /**
     * @param {?} address
     * @return {?}
     */
    GeoLocationService.prototype.getLocationFromAddress = function (address) {
        return this.get('geolocation/location-from-address', { query: { address: address } });
    };
    return GeoLocationService;
}(APIService));
GeoLocationService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GeoLocationService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var ServicesService = (function (_super) {
    __extends(ServicesService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function ServicesService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'services', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    return ServicesService;
}(CRUDService));
ServicesService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ServicesService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var ConfigurationsService = (function (_super) {
    __extends(ConfigurationsService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     * @param {?} appConfig
     * @param {?} eventsManagerService
     */
    function ConfigurationsService(http, authService, appConfig, eventsManagerService) {
        var _this = _super.call(this, 'configurations', http, authService, appConfig, eventsManagerService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.appConfig = appConfig;
        _this.eventsManagerService = eventsManagerService;
        return _this;
    }
    return ConfigurationsService;
}(CRUDService));
ConfigurationsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ConfigurationsService.ctorParameters = function () { return [
    { type: HttpInterceptor, },
    { type: AuthService, },
    { type: AppConfigService, },
    { type: EventManagerService, },
]; };
var LizardSDKModule = (function () {
    function LizardSDKModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    LizardSDKModule.forRoot = function (config) {
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
    };
    /**
     * @return {?}
     */
    LizardSDKModule.forChild = function () {
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
    };
    return LizardSDKModule;
}());
LizardSDKModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
LizardSDKModule.ctorParameters = function () { return []; };
// Public classes.
/**
 * Entry point for all public APIs of the package.
 */
/**
 * Generated bundle index. Do not edit.
 */
export { LocalStorageService, AuthService, APIService, CRUDService, UsersService, Oauth2Service, CompaniesService, OrdersService, GeoLocationService, ServicesService, ConfigurationsService, EventManagerService, AppConfigService, LizardSDKModule, HttpInterceptor as ɵa, INITIAL_CONFIG as ɵb };
//# sourceMappingURL=lizard-angular-sdk.es5.js.map
