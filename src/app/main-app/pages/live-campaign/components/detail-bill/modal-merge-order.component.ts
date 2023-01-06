import { TDSNotificationService } from 'tds-ui/notification';
import { FastSaleOrderModelDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PartnerCanMergeOrdersDto, OrderLiveCampaignCanMergeDto } from './../../../../dto/live-campaign/sale-order-livecampaign.dto';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal-merge-order',
  templateUrl: './modal-merge-order.component.html',
  providers: [TDSDestroyService]
})

export class ModalMergeOrderComponent implements OnInit, OnChanges {

  @Input() liveCampaignId: any;
  @Input() lstPartner!: PartnerCanMergeOrdersDto[];

  lstOrders: OrderLiveCampaignCanMergeDto[] = [];
  isLoading: boolean = false;
  isLoadingExpand: boolean = false;

  setOfCheckedId = new Set<number>();
  expandSet = new Set<number>();
  checked = false;
  indeterminate = false;
  isMerge: boolean = false;
  isLoadingAll: boolean = false;

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private notification: TDSNotificationService) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['liveCampaignId'] && !changes['liveCampaignId'].firstChange) {
        this.liveCampaignId = changes['liveCampaignId'].currentValue;
        this.loadPartnerCanMergeOrders();
    }

    // if(changes['lstPartner'] && !changes['lstPartner'].firstChange) {
    //     this.lstPartner = changes['lstPartner'].currentValue;
    // }
  }

  loadPartnerCanMergeOrders() {
  }

  loadOrderCanMergeByPartnerId(partnerId: number) {
    this.isLoadingExpand = true;
    this.fastSaleOrderService.getOrderLiveCampaignCanMergeByPartner(this.liveCampaignId, partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstOrders = [...(res?.value || [])];
          this.isLoadingExpand = false;
      },
      error: (err) => {
          this.isLoadingExpand = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstPartner.forEach(item => this.updateCheckedSet(item.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstPartner.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.lstPartner.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
        this.expandSet = new Set<number>();
        this.expandSet.add(id);

        // TODO: cập nhật danh sách đơn hàng có thể gộp theo khách hàng
        this.lstOrders = [];
        this.loadOrderCanMergeByPartnerId(id);
    } else {
        this.expandSet.delete(id);
    }
  }

  mergeOrderAll(){
    if(this.isLoading) return;
    this.isLoadingAll = true;

    this.setOfCheckedId.forEach(x => {
      if(this.isLoadingAll) {
          this.mergeOrder(x);
      }
    });

    this.isLoadingAll = false;
    this.isLoading = false;
  }

  mergeOrder(partnerId: number) {
    this.isLoading = true;
    let id = this.liveCampaignId;

    this.fastSaleOrderService.getOrderLiveCampaignCanMergeByPartner(id, partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          let lstOrders = [...(res?.value || [])] as any[];
          let ids = lstOrders?.map(x => x.Id) as any[];

          if(ids && ids.length < 2) {
            let partner = this.lstPartner?.filter(x => x.Id == partnerId)[0];
            this.notification.error('Khách hàng' + partner.Name, `Số lượng hóa đơn không hợp lệ, vui lòng F5 để tải lại dữ liệu`);
            return;
          }

          let model = {
              OrderIds: ids
          }

          this.fastSaleOrderService.mergeOrders(model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: FastSaleOrderModelDTO) => {
                this.isMerge = true;

                if(this.isLoadingAll) {
                    this.isLoading = true;
                } else {
                    this.isLoading = false;
                }

                this.setOfCheckedId.delete(partnerId);

                this.lstPartner = this.lstPartner.filter(x => x.Id != partnerId);
                this.lstPartner = [...this.lstPartner];

                this.notification.success(`Mã hóa đơn ${res.Number}`, `Đã gộp đơn thành công với khách hàng: ${res.Name || res.Partner?.DisplayName}`, { duration: 3000 });
            },
            error: (err) => {
                this.isLoading = false;
                this.isLoadingAll = false;
                this.message.error(err?.error?.message);
            }
          });

          this.isLoadingExpand = false;
      },
      error: (err: any) => {
          this.isLoadingExpand = false;
          this.isLoading = false;
          this.isLoadingAll = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  onCancel() {
    this.modal.destroy(this.isMerge);
  }
}
