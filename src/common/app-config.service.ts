import { Injectable, Inject } from '@angular/core';
import { ILizardConfig } from './lizard-config.interface';

import { INITIAL_CONFIG } from '../lizard-initial-config';

export class AppConfigService {
    private initialConfig: ILizardConfig;

    constructor( @Inject(INITIAL_CONFIG) config: ILizardConfig) {
        this.initialConfig = config;
    }

    public setInitialConfig(config: ILizardConfig) {
        this.initialConfig = config;
    }

    public get config(): ILizardConfig {
        return this.initialConfig;
    }
}
