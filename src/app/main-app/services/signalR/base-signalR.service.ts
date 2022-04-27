
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { TCommonService } from "../../../lib";

@Injectable({
  providedIn: 'root'
})

export abstract class BaseSignalRSevice {
    protected get _SIGNALR_URL() {
        return environment.signalR;
    };

    protected get _SIGNALR_APPENDER() {
        return environment.signalRAppend;
    };

    constructor(public libCommon: TCommonService) { }
}
