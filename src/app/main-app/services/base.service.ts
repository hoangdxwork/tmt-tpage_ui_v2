import { OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { TDSHelperObject, TDSSafeAny } from "tmt-tang-ui";
import { TCommonService, THelperCacheService } from "../../lib";

export abstract class BaseSevice {
    protected abstract prefix: string;
    protected abstract table: string;
    protected abstract baseRestApi: string;
    protected get _BASE_URL() {
        return environment.apiApp
    };

    constructor(public libCommon: TCommonService) { }

}
