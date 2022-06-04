import { finalize } from 'rxjs/operators';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { MessageDeliveryHistoryLiveCampaignParamsDTO } from 'src/app/main-app/dto/common/table.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ODataParamsDTO } from 'src/app/main-app/dto/odata/odata.dto';

@Component({
  selector: 'detail-message',
  templateUrl: './detail-message.component.html'
})
export class DetailMessageComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor( ) { }

  ngOnInit(): void {
  }

}
