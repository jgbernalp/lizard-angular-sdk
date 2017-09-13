import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';

import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

@Injectable()
export class CompaniesService extends CRUDService {
    constructor(public http: Http,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super('companies', http, authService, appConfig, eventsManagerService);
    }
}
