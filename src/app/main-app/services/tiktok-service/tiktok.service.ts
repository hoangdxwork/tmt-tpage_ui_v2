import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';

import { TDSHelperString } from 'tds-ui/shared/utility';
import { Injectable } from '@angular/core';
import { TUserDto } from '@core/dto/tshop.dto';
import { ReplaySubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSMessageService } from 'tds-ui/message';
import { BaseSevice } from '../base.service';

@Injectable({
  providedIn: 'root'
})

export class TiktokService extends BaseSevice {
    prefix: string = "odata";
    table: string = "";
    baseRestApi: string = "";
    
    constructor(private apiService: TCommonService,
        private message: TDSMessageService) {
        super(apiService)
    }

    login(id: string) {
        const api: CoreAPIDTO = {
            url: `${this._BASE_URL}/rest/v2.0/chatomni/unofficialtiktok/${id}`,
            method: CoreApiMethodType.get,
          }
      
          return this.apiService.getData<any>(api, null);
    }
}