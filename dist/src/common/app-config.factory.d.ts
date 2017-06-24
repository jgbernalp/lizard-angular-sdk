import { ILizardConfig } from './lizard-config.interface';
export declare class AppConfig {
    private static initialConfig;
    static setInitialConfig(config: ILizardConfig): void;
    static readonly config: ILizardConfig;
}
