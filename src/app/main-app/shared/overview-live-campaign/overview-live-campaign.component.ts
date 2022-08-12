import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs';
import { LiveCampaignService } from './../../services/live-campaign.service';
import { ReportLiveCampaignDetailDTO, ReportLiveCampaignDTO } from './../../dto/live-campaign/report-livecampain-overview.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'overview-live-campaign',
  templateUrl: './overview-live-campaign.component.html',
  providers : [TDSDestroyService]
})

export class OverviewLiveCampaignComponent implements OnInit {

  @Input() lstOfData!: ReportLiveCampaignDTO;
  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  indClickStatus:string = '';
  currentQuantity:number = 0;

  constructor(private modelRef: TDSModalRef,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService) { }

  ngOnInit(): void {}

  openQuantityPopover(data: ReportLiveCampaignDetailDTO, dataId: string) {
    this.indClickStatus = dataId;
    this.currentQuantity = data.Quantity || 0;
  }

  changeQuantity(value:number){
    this.currentQuantity = value;
  }

  saveChangeQuantity(id: string){
    this.liveCampaignService.updateProductQuantity(id, this.currentQuantity, this.liveCampaignId).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        
        this.lstOfData.Details.map((item)=>{
          if(item.Id == id){
            item.Quantity = this.currentQuantity;
            item.RemainQuantity = item.Quantity - item.UsedQuantity;

            this.message.success('Cập nhật số lượng thành công');
            this.indClickStatus = '';
          }
        })
      },
      err => {
        this.message.error(err?.error?.message || 'Cập nhật số lượng thất bại');
        this.indClickStatus = '';
      })
  }

  closeQuantityPopover(): void {
    this.indClickStatus = '';
  }

  onCannel() {
    this.modelRef.destroy(null);
  }
}
