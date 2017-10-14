import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../common/http-interceptor.service';

import { AuthService } from '../common/auth.service';
import { CRUDService } from '../common/crud.service';

import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

@Injectable()
export class ConfigurationsService extends CRUDService {
    constructor(public http: HttpInterceptor,
        public authService: AuthService,
        public appConfig: AppConfigService,
        public eventsManagerService: EventManagerService
    ) {
        super('configurations', http, authService, appConfig, eventsManagerService);
    }
}
