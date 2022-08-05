import { finalize, takeUntil } from 'rxjs/operators';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ModalLiveCampaignOrderComponent } from '../modal-live-campaign-order/modal-live-campaign-order.component';
import { ModalLiveCampaignBillComponent } from '../modal-live-campaign-bill/modal-live-campaign-bill.component';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { Subject } from 'rxjs';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html'
})
export class DetailReportComponent implements OnInit {

  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  data!: any;
  indClickQuantity: number = -1;

  currentChangeQuantity?: any;

  lstDetails: any[] = [];
  dataLiveCampaign!: any;
  private destroy$ = new Subject<void>();

  constructor(
    private liveCampaignService: LiveCampaignService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.loadReportLiveCampaign(this.liveCampaignId);
    this.loadLiveCampaign(this.liveCampaignId);
  }

  loadReportLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getReport(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
        this.lstDetails = [...res?.Details];
      }, error => {
        this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
      })
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.dataLiveCampaign = res;
      }, error => {
        this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
      });
  }

  onChangeQuantity(data: any, index: number) {
    this.indClickQuantity = index;
    this.currentChangeQuantity = Object.assign({}, data);
  }

  onCloseQuantity() {
    this.indClickQuantity = -1;
    this.currentChangeQuantity = undefined;
  }

  onSaveQuantity(data: any) {
    if (this.currentChangeQuantity) {
      this.isLoading = true;
      this.liveCampaignService.updateProductQuantity(this.currentChangeQuantity.Id, this.currentChangeQuantity.Quantity, this.liveCampaignId)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
        .subscribe(res => {
          data.Quantity = this.currentChangeQuantity?.Quantity || 0;
          this.message.success(Message.UpdatedSuccess);
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
    else {
      this.message.error(Message.ErrorOccurred);
    }
  }

  showModalLiveCampaignOrder(lstData: any[]) {
    this.modal.create({
      title: 'Đơn hàng chờ chốt',
      size: 'xl',
      content: ModalLiveCampaignOrderComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: lstData
      }
    });
  }

  showModalLiveCampaignBill(lstData: any[]) {
    this.modal.create({
      title: 'Hóa đơn chờ chốt',
      size: 'xl',
      content: ModalLiveCampaignBillComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: lstData
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
