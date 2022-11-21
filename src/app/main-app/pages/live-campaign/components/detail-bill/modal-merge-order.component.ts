import { TDSNotificationService } from 'tds-ui/notification';
import { FastSaleOrderModelDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { finalize, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PartnerCanMergeOrdersDto, OrderLiveCampaignCanMergeDto } from './../../../../dto/live-campaign/sale-order-livecampaign.dto';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-merge-order',
  templateUrl: './modal-merge-order.component.html',
  providers: [TDSDestroyService]
})
export class ModalMergeOrderComponent implements OnInit {
  @Input() liveCampaignId: any;
  @Input() lstPartners!: PartnerCanMergeOrdersDto[];

  lstOrders: OrderLiveCampaignCanMergeDto[] = [];
  isLoading: boolean = false;
  isLoadingCollapse: boolean = false;

  setOfCheckedId = new Set<number>();
  expandSet = new Set<number>();
  checked = false;
  indeterminate = false;
  isMerge: boolean = false;
  key: any = 0;

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private notification: TDSNotificationService) { }

  ngOnInit(): void {}

  loadPartner() {
    this.isLoading = true;

    this.fastSaleOrderService.getPartnerCanMergeOrders(this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        let exist = res && res.value.length > 0;

        if(exist) {
          this.lstPartners = [...res.value];
        } else {
          this.lstPartners = [];
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error('Lỗi', err?.error?.message);
      }
    })
  }

  loadOrderCanMergeByPartnerId(id: any) {
    this.isLoadingCollapse = true;

    this.fastSaleOrderService.getOrderLiveCampaignCanMergeByPartner(this.liveCampaignId, id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res && res.value) {
          this.lstOrders = [...res.value];
        }

        this.isLoadingCollapse = false;
      },
      error: (err) => {
        this.isLoadingCollapse = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
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
    this.lstPartners.forEach(item => this.updateCheckedSet(item.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstPartners.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.lstPartners.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<number>();
      this.expandSet.add(id);
      this.key = id;
      // TODO: cập nhật danh sách đơn hàng có thể gộp theo khách hàng
      this.lstOrders = [];
      this.loadOrderCanMergeByPartnerId(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  mergeListOrders(){
    if(this.isLoading) {
      return;
    }

    this.setOfCheckedId.forEach(x => {
      this.mergeOrder(x);
    })
  }

  mergeOrder(partnerId: number) {
    this.isLoading = true;

    this.fastSaleOrderService.getOrderLiveCampaignCanMergeByPartner(this.liveCampaignId, partnerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if(res && res.value) {
            let lstOrders = [...res.value];
            let model = {
              OrderIds: lstOrders.map(x => x.Id)
            }
        
            this.fastSaleOrderService.mergeOrders(model).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: FastSaleOrderModelDTO) => {
                this.notification.success(`Mã khách hàng <span class="text-info-500">${partnerId}</span>`, `Gộp đơn thành công`);
                this.isMerge = true;
                this.setOfCheckedId.delete(partnerId);
                this.loadPartner();
              },
              error: (err) => {
                this.isLoading = false;
                this.notification.error(`Lỗi: Mã khách hàng <span class="text-info-500">${partnerId}</span>`, `${err?.error?.message}`);
              }
            })
          }

          this.isLoadingCollapse = false;
        },
        error: (err) => {
          this.isLoadingCollapse = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
    })
  }

  onCancel() {
    if(this.isMerge) {
      this.modal.destroy(true);
    } else {
      this.modal.destroy(null);
    }
  }
}
