import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalStorageService } from '../common/local-storage.service';
import { AuthService } from '../common/auth.service';
import { APIService } from '../common/api.service';

import { UsersService } from '../resources/users.service';

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
    public static forRoot(): ModuleWithProviders {
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

    public static forChild(): ModuleWithProviders {
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
