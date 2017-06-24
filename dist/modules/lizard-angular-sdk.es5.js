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
import { Injectable, NgModule } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
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
        localStorage.removeItem(key);
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
var AuthService = (function () {
    /**
     * @param {?} http
     * @param {?} localStorage
     */
    function AuthService(http, localStorage) {
        this.http = http;
        this.localStorage = localStorage;
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
     * @return {?}
     */
    AuthService.prototype.getAccessToken = function () {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('AT');
        }
        return this.cachedAccessToken;
    };
    /**
     * @param {?} user
     * @return {?}
     */
    AuthService.prototype.setUser = function (user) {
        this.localStorage.set('US', user);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getUser = function () {
        if (!this.cachedAccessToken) {
            this.cachedAccessToken = this.localStorage.get('US');
        }
        return this.cachedAccessToken;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.isLoggedIn = function () {
        return this.getUser() != null;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.logout = function () {
        this.localStorage.remove('AT');
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
]; };
var AppConfig = (function () {
    function AppConfig() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    AppConfig.setInitialConfig = function (config) {
        AppConfig.initialConfig = config;
    };
    Object.defineProperty(AppConfig, "config", {
        /**
         * @return {?}
         */
        get: function () {
            return AppConfig.initialConfig;
        },
        enumerable: true,
        configurable: true
    });
    return AppConfig;
}());
var APIService = (function () {
    /**
     * @param {?} http
     * @param {?} authService
     */
    function APIService(http, authService) {
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
    APIService.prototype.get = function (path, query, options) {
        return this.http.get(this.apiURL + '/' + path + this.getUrlParams(query), this.getRequestOptions(options))
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
        if (!options || options.credentials === undefined || options.credentials === true) {
            headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
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
                params.push(key + '=' + encodeURIComponent(data[key]));
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
        var /** @type {?} */ body = res.json();
        return body.data || {};
    };
    /**
     * @param {?} error
     * @return {?}
     */
    APIService.prototype.handleError = function (error) {
        // TODO use a remote logging infrastructure
        var /** @type {?} */ errMsg;
        if (error instanceof Response) {
            var /** @type {?} */ body = error.json() || '';
            var /** @type {?} */ err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
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
    { type: Http, },
    { type: AuthService, },
]; };
var CRUDService = (function (_super) {
    __extends(CRUDService, _super);
    /**
     * @param {?} resourceName
     * @param {?} http
     * @param {?} authService
     */
    function CRUDService(resourceName, http, authService) {
        var _this = _super.call(this, http, authService) || this;
        _this.http = http;
        _this.authService = authService;
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
    /**
     * @param {?=} query
     * @param {?=} limit
     * @param {?=} fields
     * @param {?=} sort
     * @param {?=} options
     * @return {?}
     */
    CRUDService.prototype.list = function (query, limit, fields, sort, options) {
        if (query === void 0) { query = {}; }
        return this.get(this.resourceName, { query: query, fields: fields, sort: sort }, options);
    };
    /**
     * @param {?} resourceId
     * @param {?=} fields
     * @param {?=} options
     * @return {?}
     */
    CRUDService.prototype.read = function (resourceId, fields, options) {
        return this.get(this.resourceName + '/' + resourceId, { fields: fields }, options);
    };
    /**
     * @param {?} resource
     * @param {?} data
     * @param {?} options
     * @return {?}
     */
    CRUDService.prototype.save = function (resource, data, options) {
        if (resource[this.resourceIdName]) {
            return this.put(this.resourceName + '/' + resource[this.resourceIdName], data, options);
        }
        else {
            return this.post(this.resourceName, data, options);
        }
    };
    /**
     * @param {?} resourceId
     * @param {?} options
     * @return {?}
     */
    CRUDService.prototype.delete = function (resourceId, options) {
        return _super.prototype.delete.call(this, this.resourceName + '/' + resourceId, options);
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
    { type: Http, },
    { type: AuthService, },
]; };
var UsersService = (function (_super) {
    __extends(UsersService, _super);
    /**
     * @param {?} http
     * @param {?} authService
     */
    function UsersService(http, authService) {
        var _this = _super.call(this, 'users', http, authService) || this;
        _this.http = http;
        _this.authService = authService;
        _this.localOnUserLogsIn = new Subject();
        return _this;
    }
    Object.defineProperty(UsersService.prototype, "onUserLogsIn", {
        /**
         * @return {?}
         */
        get: function () {
            return this.localOnUserLogsIn.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    UsersService.prototype.login = function (username, password) {
        var _this = this;
        return this.post('login', { username: username, password: password }, null, { credentials: false })
            .map(function (loginResponse) {
            if (loginResponse && loginResponse.access_token) {
                var /** @type {?} */ accessToken = loginResponse.access_token;
                _this.authService.setAccessToken(accessToken);
                _this.localOnUserLogsIn.next();
            }
            return Observable.of(loginResponse);
        });
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
    { type: Http, },
    { type: AuthService, },
]; };
var LizardSDKModule = (function () {
    function LizardSDKModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    LizardSDKModule.forRoot = function (config) {
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
                UsersService
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
export { LocalStorageService, AuthService, APIService, UsersService, LizardSDKModule, CRUDService as ɵa };
//# sourceMappingURL=lizard-angular-sdk.es5.js.map
