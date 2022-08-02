import { Injectable } from "@angular/core";
import { CoreAPIDTO } from "@core/dto";
import { CoreApiMethodType } from "@core/enum";
import { TCommonService } from "@core/services";
import { Observable } from "tinymce";
import { BaseSevice } from "../base.service";

@Injectable()

export class ChatomniObjectsService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  urlNext: string | undefined;

  constructor(private apiService: TCommonService) {
      super(apiService)
  }

  // getLink(url: string): Observable<any>  {
  //   let api: CoreAPIDTO = {
  //         url: `${url}`,
  //         method: CoreApiMethodType.get
  //     }
  //     return this.apiService.getData<any>(api, null);
  // }
}
