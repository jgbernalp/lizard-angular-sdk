import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend, Headers } from "@angular/http"
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import "rxjs/add/operator/mergeMap";

import { EventManagerService } from '../common/event-manager.service';

@Injectable()
export class HttpInterceptor extends Http {
  private notifier: Subject<Response> = new Subject<Response>();

  private refreshingToken: boolean = false;

  constructor(
    backend: XHRBackend,
    options: RequestOptions,
    public eventManager: EventManagerService
  ) {
    super(backend, options);

    this.eventManager.onTokenRefreshed.subscribe(({ newAccessToken }) => {
      this.refreshingToken = false;

      this.notifier.next(newAccessToken);
    })
  }

  private getNewHeaders(headers: Headers, newAccessToken: string): Headers {
    headers.set('authorization', newAccessToken);

    return headers;
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    const requestUrl = url as Request;

    if (requestUrl.url.indexOf('oauth2/token') >= 0) {
      return super.request(url, options);
    } else if (this.refreshingToken) {
      return this.notifier.asObservable().flatMap(() => {
        return super.request(url, options);
      });
    } else {
      return super.request(url, options).catch((error: any) => {
        if (error && error.status == 401) {
          const body = JSON.parse(error._body);
          if (body && body.error && body.error.code == 100) {
            this.refreshingToken = true;

            this.eventManager.trigger(EventManagerService.REFRESH_TOKEN);

            return this.notifier.asObservable().flatMap((newAccessToken: any) => {
              const newRequest = new Request({
                headers: this.getNewHeaders(requestUrl.headers, newAccessToken),
                url: requestUrl.url,
                body: requestUrl.getBody(),
                method: requestUrl.method,
                responseType: requestUrl.responseType
              });

              return super.request(newRequest, options);
            });
          } else {
            return Observable.throw(error);
          }
        }

        return Observable.throw(error);
      });
    }
  }
}