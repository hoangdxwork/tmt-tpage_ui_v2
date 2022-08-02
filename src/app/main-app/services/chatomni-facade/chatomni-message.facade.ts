import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { ChatomniMessageDTO } from "../../dto/conversation-all/chatomni/chatomni-message.dto";
import { set as _set } from 'lodash';

@Injectable()

export class ChatomniMessageFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniMessageDTO } = {}; //this.chatomniDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(id: string, value: ChatomniMessageDTO | null) {
      _set(this.dataSource, [id], value);
  }

  getData(id: string) {
      let data = _get(this.dataSource, id) || undefined;
      return data;
  }

}
