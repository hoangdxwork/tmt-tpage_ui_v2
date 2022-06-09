import { TDSMessageService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/main-app/services/common.service';
import { MessageDeliveryHistoryDTO } from 'src/app/main-app/dto/common/table.dto';

@Component({
  selector: 'drawer-order-message',
  templateUrl: './drawer-order-message.component.html',
  styleUrls: ['./drawer-order-message.component.scss']
})
export class DrawerOrderMessageComponent implements OnInit {

  @Input() isOpenDrawer!: boolean;
  @Input() liveCampaignId!: string;
  @Input() orderId!: string;

  @Output() eventClose = new EventEmitter();

  lstData: MessageDeliveryHistoryDTO[] = []

  count = 0;
  isLoading: boolean = false;
  skip: number = 0;
  take: number = 20;

  constructor(
    private message: TDSMessageService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadData(this.liveCampaignId, this.orderId, this.skip, this.take);
  }

  loadData(liveCampaignId: string, orderId: string, skip: number, take: number) {
    this.isLoading = true;

    this.commonService.getHistoryMessageSentSO(liveCampaignId, orderId, skip, take)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstData = res?.Datas;
        this.count = res?.Total || 0;
        console.log(this.lstData);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }


  close() {
    this.isOpenDrawer = false;
    this.eventClose.emit(false);
  }

}
