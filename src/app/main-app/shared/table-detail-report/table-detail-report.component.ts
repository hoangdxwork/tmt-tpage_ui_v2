import { Router } from '@angular/router';
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
    @Input() lstDetails!: ReportLiveCampaignDetailDTO[];

    indClickQuantity: string = '';
    currentQuantity: number = 0;
    isLoading: boolean = false;
    // routerCheck!: string;
    lstSearch!: ReportLiveCampaignDetailDTO[];

    numberWithCommas =(value:TDSSafeAny) =>{
        if(value != null)
        {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return value;
      } ;

      parserComas = (value: TDSSafeAny) =>{
        if(value != null)
        {
          return TDSHelperString.replaceAll(value,'.','');
        }
        return value;
      };

    constructor(private message: TDSMessageService,
        private modalService: TDSModalService,
        // private router: Router,
        private viewContainerRef: ViewContainerRef,
        private destroy$: TDSDestroyService,
        private liveCampaignService: LiveCampaignService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.lstSearch = [...this.lstDetails];
        // this.routerCheck = this.router.url;
        this.cdr.detectChanges();
    }

    showModalLiveCampaignOrder(lstOrder: any[]) {
        if(!lstOrder){
            return
        }

        if(lstOrder.length == 0){
            return
        }

        this.modalService.create({
            title: 'Đơn hàng chờ chốt',
            size: 'xl',
            content: ModalLiveCampaignOrderComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
                data: lstOrder
            }
        });
    }

    showModalLiveCampaignBill(lstFastSaleOrder: any[]) {
        if(!lstFastSaleOrder){
            return
        }

        if(lstFastSaleOrder.length == 0){
            return
        }

        this.modalService.create({
            title: 'Hóa đơn chờ chốt',
            size: 'xl',
            content: ModalLiveCampaignBillComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
                data: lstFastSaleOrder
            }
        });
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
        if(event && TDSHelperString.hasValueString(event.value)){
            this.lstSearch = this.lstDetails.filter((item) => (item.ProductName && TDSHelperString.stripSpecialChars(item.ProductName.toLowerCase().trim()).indexOf(TDSHelperString.stripSpecialChars(event.value.toLowerCase().trim())) !== -1))
        }else{
            this.lstSearch = [...this.lstDetails];
        }
    }
}
