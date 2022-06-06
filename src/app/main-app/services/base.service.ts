import { TCommonService } from "../../lib";
import { BaseHelper } from "../shared/helper/base.helper";

export abstract class BaseSevice {

    protected abstract prefix: string;
    protected abstract table: string;
    protected abstract baseRestApi: string;

    protected get _BASE_URL() {
        return BaseHelper.getBaseApi();
    };

    constructor(public libCommon: TCommonService) { }

}
