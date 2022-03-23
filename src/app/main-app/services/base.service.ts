import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { TCommonService } from "../../lib";

export abstract class BaseSevice {
    protected abstract prefix: string;
    protected abstract table: string;
    protected abstract baseRestApi: string;
    protected get _BASE_URL() {
        return environment.apiApp
    };
    constructor(public libCommon: TCommonService) { }

}