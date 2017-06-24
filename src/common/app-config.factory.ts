import { Injectable } from '@angular/core';
import { ILizardConfig } from './lizard-config.interface';

export class AppConfig {
    private static initialConfig: ILizardConfig;
    public static setInitialConfig(config: ILizardConfig) {
        AppConfig.initialConfig = config;
    }

    public static get config(): ILizardConfig {
        return AppConfig.initialConfig;
    }
}
