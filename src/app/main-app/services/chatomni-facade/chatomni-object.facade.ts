import { EventEmitter, Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniObjectsDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";

@Injectable()

export class ChatomniObjectFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniObjectsDto } = {};

  // Tạo đơn hàng từ commment, lại danh sách đơn hàng
  public loadListOrderFromCreateOrderComment$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(teamId: number, value: ChatomniObjectsDto | null) {
      _set(this.dataSource, [teamId], value);
  }

  getData(teamId: number) {
      let data = _get(this.dataSource, teamId) || undefined;
      return data;
  }

}
