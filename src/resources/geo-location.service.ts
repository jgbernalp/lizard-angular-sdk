import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AuthService } from '../common/auth.service';
import { APIService } from '../common/api.service';

import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeoLocationService extends APIService {
    constructor(public http: Http,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super(http, authService, appConfig, eventsManagerService);
    }

    getAddressFromLocation(lat: Number, lng: Number): Observable<any> {
        return this.get('geolocation/address-from-location', { query: { lat, lng } });
    }

    getLocationFromAddress(address: string): Observable<any> {
        return this.get('geolocation/location-from-address', { query: { address } });
    }
}
