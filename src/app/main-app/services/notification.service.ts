import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { GeneralConfigUpdateDTO, ShippingStatuesDTO } from "../dto/configs/general-config.dto";
import { BaseSevice } from "./base.service";
import { NotificationGetMappingDTO, TPosAppMongoDBNotificationDTO } from '../dto/notification/notification.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Notification";
  baseRestApi: string = "api/Notification";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getMapping(data: NotificationGetMappingDTO): Observable<PagedList2<TPosAppMongoDBNotificationDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getmappings`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<PagedList2<TPosAppMongoDBNotificationDTO>>(api, data);
  }

  getById(id: string): Observable<TPosAppMongoDBNotificationDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TPosAppMongoDBNotificationDTO>(api, null);
  }

}
