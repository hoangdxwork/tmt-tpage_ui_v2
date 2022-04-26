
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { TCommonService } from "../../../lib";

@Injectable({
  providedIn: 'root'
})

export abstract class BaseSignalRSevice {
    protected get _BASE_URL() {
        return environment.signalR;
    };

    constructor(public libCommon: TCommonService) { }

}
