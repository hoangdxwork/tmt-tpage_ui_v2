import { ReportLiveCampaignDetailDTO } from '../../dto/live-campaign/report-livecampain-overview.dto';
import { Message } from '../../../lib/consts/message.const';
import { finalize, takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ModalLiveCampaignBillComponent } from '../../pages/live-campaign/components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalLiveCampaignOrderComponent } from '../../pages/live-campaign/components/modal-live-campaign-order/modal-live-campaign-order.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';

@Component({
    selector: 'table-detail-report',
    templateUrl: './table-detail-report.component.html',
    providers: [TDSDestroyService]
})
export class TableDetailReportComponent implements OnInit {

    @Input() liveCampaignId!: string;
    @Input() lstDetails!: ReportLiveCampaignDetailDTO[];

    indClickQuantity: string = '';
    currentQuantity: number = 0;
    isLoading: boolean = false;

    constructor(private message: TDSMessageService,
        private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef,
        private destroy$: TDSDestroyService,
        private liveCampaignService: LiveCampaignService
    ) { }

    ngOnInit(): void { }

    showModalLiveCampaignOrder(lstOrder: any[]) {
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

        this.liveCampaignService.updateProductQuantity(id, this.currentQuantity, this.liveCampaignId)
            .pipe(takeUntil(this.destroy$), finalize(()=> this.isLoading = false ))
            .subscribe(res => {

                this.lstDetails.map((item) => {
                    if (item.Id == id) {
                        item.Quantity = this.currentQuantity;
                        item.RemainQuantity = item.Quantity - item.UsedQuantity;

                        this.message.success(Message.UpdateQuantitySuccess);
                        this.indClickQuantity = '';
                    }
                })
            },
            err => {
                this.message.error(err?.error?.message || Message.UpdateQuantityFail);
                this.indClickQuantity = '';
            })
    }

    closeQuantityPopover(): void {
        this.indClickQuantity = '';
    }
}