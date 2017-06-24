import { ModuleWithProviders } from '@angular/core';
import { ILizardConfig } from '../common/lizard-config.interface';
export declare class LizardSDKModule {
    static forRoot(config: ILizardConfig): ModuleWithProviders;
    static forChild(): ModuleWithProviders;
}
