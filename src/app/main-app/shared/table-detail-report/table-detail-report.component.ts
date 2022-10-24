import { TDSTableQueryParams } from 'tds-ui/table';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { ReportLiveCampaignDetailDTO } from '../../dto/live-campaign/report-livecampain-overview.dto';
import { Message } from '../../../lib/consts/message.const';
import { takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ModalLiveCampaignBillComponent } from '../../pages/live-campaign/components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalLiveCampaignOrderComponent } from '../../pages/live-campaign/components/modal-live-campaign-order/modal-live-campaign-order.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';

@Component({
    selector: 'table-detail-report',
    templateUrl: './table-detail-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TDSDestroyService]
})

export class TableDetailReportComponent implements OnInit {

    @Input() liveCampaignId!: string;
    @Input() tableHeight: number = 300;

    lstDetails: ReportLiveCampaignDetailDTO[] = [];
    count!: number;
    indClickQuantity: string = '';
    currentQuantity: number = 0;
    isLoading: boolean = false;
    innerText: string = '';

    pageSize: number = 10;
    pageIndex: number = 1;

    numberWithCommas =(value:TDSSafeAny) =>{
      if(value != null){
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return value;
    }

    parserComas = (value: TDSSafeAny) =>{
      if(value != null){
        return TDSHelperString.replaceAll(value,'.','');
      }
      return value;
    };

    constructor(private message: TDSMessageService,
        private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef,
        private destroy$: TDSDestroyService,
        private liveCampaignService: LiveCampaignService,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
    }

    loadData(pageSize: number, pageIndex: number, text?: string) {
        this.isLoading = true;
        let params = THelperDataRequest.convertDataRequestToStringShipTake(pageSize, pageIndex, text);
        this.liveCampaignService.overviewDetailsReport(this.liveCampaignId, params).pipe(takeUntil(this.destroy$)).subscribe({
            next: res => {
                this.lstDetails = [...res.Details];
                this.count = res.TotalCount;
                this.isLoading = false;

                this.cdr.detectChanges();
            },
            error: error => {
                this.isLoading = false;
                this.message.error(error?.error?.message || 'Tải sản phẩm lỗi')
            }
        })
    }

    onQueryParamsChange(event: TDSTableQueryParams) {
        this.loadData(event.pageSize, event.pageIndex, this.innerText);
    }
    

    showModalLiveCampaignOrder(id: string, index: number) {
        if(index){
            this.modalService.create({
                title: 'Đơn hàng chờ chốt',
                size: 'xl',
                content: ModalLiveCampaignOrderComponent,
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                    livecampaignDetailId: id
                }
            });
        }
    }

    showModalLiveCampaignBill(id: string, index: number) {
        if(index){
            this.modalService.create({
                title: 'Hóa đơn chờ chốt',
                size: 'xl',
                content: ModalLiveCampaignBillComponent,
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                    livecampaignDetailId: id
                }
            });
        }
    }

    openQuantityPopover(data: ReportLiveCampaignDetailDTO, dataId: string) {
        this.indClickQuantity = dataId;
        this.currentQuantity = data.Quantity || 0;
    }

    changeQuantity(value: number) {
        this.currentQuantity = value;
    }

    saveChangeQuantity(id: string) {
        this.isLoading = true;
        this.liveCampaignService.updateProductQuantity(id, this.currentQuantity, this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
          next:(res) => {
              this.lstDetails.map((item) => {
                  if (item.Id == id) {
                      item.Quantity = this.currentQuantity;
                      item.RemainQuantity = item.Quantity - item.UsedQuantity;

                      this.message.success(Message.UpdateQuantitySuccess);
                      this.indClickQuantity = '';
                  }
              })

              this.isLoading = false;
              this.cdr.detectChanges();
          },
          error:(err) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || Message.UpdateQuantityFail);

              this.indClickQuantity = '';
              this.cdr.detectChanges();
          }
      })
    }

    closeQuantityPopover(): void {
        this.indClickQuantity = '';
    }

    onSearch(event: TDSSafeAny) {
        let text = TDSHelperString.stripSpecialChars(event.value?.toLocaleLowerCase()).trim();
        this.innerText = text;
        this.pageIndex = 1;
        this.loadData(this.pageSize, this.pageIndex, text);
    }

    onRefresh(){
        this.pageIndex = 1;
        this.pageSize = 10;
        this.innerText = '';
        this.loadData(this.pageSize, this.pageIndex);
    }
}
