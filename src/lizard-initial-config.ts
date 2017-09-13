import { ILizardConfig } from './common/lizard-config.interface';
import { InjectionToken } from '@angular/core';

export let INITIAL_CONFIG = new InjectionToken<ILizardConfig>('app.config');