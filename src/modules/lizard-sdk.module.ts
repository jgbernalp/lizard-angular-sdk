import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalStorageService } from '../common/local-storage.service';
import { AuthService } from '../common/auth.service';
import { APIService } from '../common/api.service';
import { ILizardConfig } from '../common/lizard-config.interface';
import { AppConfigService } from '../common/app-config.service';
import { EventManagerService } from '../common/event-manager.service';

import { INITIAL_CONFIG } from '../lizard-initial-config';

import { UsersService } from '../resources/users.service';
import { Oauth2Service } from '../resources/oauth2.service';
import { CompaniesService } from '../resources/companies.service';
import { OrdersService } from '../resources/orders.service';
import { ServicesService } from '../resources/services.service';
import { GeoLocationService } from '../resources/geo-location.service';

@NgModule({
    declarations: [
        // Pipes.
        // Directives.
    ],
    exports: [
        // Pipes.
        // Directives.
    ]
})
export class LizardSDKModule {
    public static forRoot(config: ILizardConfig): ModuleWithProviders {
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

                UsersService,
                Oauth2Service,
                CompaniesService,
                OrdersService,
                GeoLocationService,
                ServicesService
            ]
        };
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: LizardSDKModule,
            providers: [
                APIService,
                AuthService,
                APIService,
                AppConfigService,
                EventManagerService,

                UsersService,
                Oauth2Service,
                CompaniesService,
                OrdersService,
                GeoLocationService,
                ServicesService
            ]
        };
    }

}
