import { TDSNotificationService } from 'tds-ui/notification';
import { FastSaleOrderModelDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { takeUntil } from 'rxjs';
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

  expandSet = new Set<number>();

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
          this.notification.error('Thông báo', 'Không còn đơn nào hợp lệ');
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
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

  mergeOrder(data: PartnerCanMergeOrdersDto) {
    this.isLoading = true;

    this.fastSaleOrderService.getOrderLiveCampaignCanMergeByPartner(this.liveCampaignId, data.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res && res.value) {
          let orders = [...res.value] as OrderLiveCampaignCanMergeDto[];

          let model = {
            OrderIds: orders.map(x => { return x.Id })
          }

          this.fastSaleOrderService.mergeOrders(model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: FastSaleOrderModelDTO) => {
              this.message.success('Gộp đơn thành công');
              // TODO: cập nhật lại danh sách partner
              this.loadPartner();
            },
            error: (err) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
            }
          })
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  onCancel() {
    this.modal.destroy(null);
  }
}
