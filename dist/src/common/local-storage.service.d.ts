import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
export declare class LocalStorageService {
    private prefix;
    set(key: string, value: any): void;
    get(key: string): any;
    remove(key: string): void;
}
