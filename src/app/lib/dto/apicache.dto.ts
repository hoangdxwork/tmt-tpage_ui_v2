import { TDSSafeAny } from "tmt-tang-ui";
import { TGlobalConfig } from "../services";

export class TAPICacheDTO {
    Data!: TDSSafeAny;
    Expire!: number;

    public build(pData: TDSSafeAny, isPer: boolean = false): boolean {
        if(TGlobalConfig.cache.timerApi > 0 && TGlobalConfig.cache.timerPermission > 0) {
            this.Data = pData;
            if (!isPer)
                this.Expire = (new Date()).getTime() + TGlobalConfig.cache.timerApi * 1000;
            else {
                this.Expire = (new Date()).getTime() + TGlobalConfig.cache.timerPermission * 1000;
            }
            return true;
        }
        return false;
    }
    public checkExpire(): boolean {
        return this.Expire < (new Date()).getTime();
    }
    
}