import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { CartHistoryEventDTO, FSOrderHistoryEventDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'modal-history-cart',
  templateUrl: './modal-history-cart.component.html'
})
export class ModalHistoryCartComponent implements OnInit {

  @Input() type!: string;
  @Input() liveCampaignId!: string;
  @Input() productId!: number;
  @Input() orderId!: string;

  isLoading: boolean = false;

  lstData: CartHistoryEventDTO[] = [];

  constructor(
    private liveCampaignService: LiveCampaignService,
    private modalRef: TDSModalRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if(this.type == "SO") {
      this.loadOrder(this.orderId);
    }
    else {
      this.loadBill(this.orderId);
    }
  }

  loadOrder(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getSOCartHistory(this.liveCampaignId, this.productId, this.orderId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstData = res.value;
      });
  }

  loadBill(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getFSCartHistory(this.liveCampaignId, this.productId, this.orderId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstData = res.HistoryEvents;
      });
  }

  convertNameEvent(name: string) {
    let result = {} as TDSSafeAny;

    switch(name) {
      case "add":
        result.name = "Thêm sản phẩm";
        result.color = "text-neutral-1-900";
        break;
      case "remove":
        result.name = "Bỏ sản phẩm";
        result.color = "text-error-400";
        break;
      case "checkout":
        result.name = "Đã chốt";
        result.color = "text-success-400";
        break;
      case "cancel_checkout":
        result.name = "Hủy chốt";
        result.color = "text-error-400";
        break;
      case "add_checkout":
        result.name = "Thêm sản phẩm vào giỏ hàng";
        result.color = "text-neutral-1-900";
        break;
      case "remove_checkout":
        result.name = "Bỏ sản phẩm ra khỏi giỏ hàng";
        result.color = "text-error-400";
        break;
      case "delete_bill":
        result.name = "Hóa đơn đã bị xóa";
        result.color = "text-error-400";
        break;
      case "cancel_bill":
        result.name = "Hóa đơn đã bị hủy";
        result.color = "text-error-400";
        break;
      case "fs_add":
        result.name = "Chỉnh sửa hóa đơn, thêm sản phẩm";
        result.color = "text-neutral-1-900";
        break;
      case "fs_remove":
        result.name = "Chỉnh sửa hóa đơn, bỏ sản phẩm";
        result.color = "text-neutral-1-900";
        break;
    }

    return result;
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
