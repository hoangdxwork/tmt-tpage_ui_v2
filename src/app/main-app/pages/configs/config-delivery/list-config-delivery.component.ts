
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { DeliveryDataResponseDto, GetDeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/get-delivery.dto';
import { DeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { TDSMessageService } from 'tds-ui/message';
import { finalize } from 'rxjs';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { isBuffer } from 'lodash';

@Component({
  selector: 'list-config-delivery',
  templateUrl: './list-config-delivery.component.html'
})

export class ListConfigDeliveryComponent implements OnInit {
  isLoading: boolean = false;
  isLoading1: boolean = false;

  providerDataSource: Array<DeliveryDataResponseDto> = [];
  deliveryDataSource: Array<DeliveryCarrierDTO> = [];
  public expandSet = new Set<number>();

  constructor(private router: Router,
    private deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private message: TDSMessageService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.deliveryCarrierV2Service.getProviderToAship()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: DeliveryResponseDto<GetDeliveryResponseDto>) => {
        if (res.Success && res.Data) {
          this.providerDataSource = res.Data.Providers;
        } else {
          this.message.error(res.Error?.Message);
        }
      });
  }

  loadDeliveryCarriesByType(providerType: string) {
    this.isLoading1 = true;
    this.deliveryCarrierV2Service.getByDeliveryType(providerType)
      .pipe(finalize(() => this.isLoading1 = false))
      .subscribe((res: Array<DeliveryCarrierDTO>) => {
        if (res)
          this.deliveryDataSource = res;
      });
  }

  onClick(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.preventDefault();

    this.loadData();
  }

  onChangeCollapse(index: number, checked: boolean): void {
    this.deliveryDataSource = [];
    this.collapseAllRow();
    if (checked) {
      this.expandSet.add(index);
      //Load data
      this.loadDeliveryCarriesByType(this.providerDataSource[index].Type)
    } else {
      this.expandSet.delete(index);
    }
  }

  private collapseAllRow() {
    this.expandSet.clear();
  }

  refreshDataDelivery(model: DeliveryDataResponseDto) {
    this.deliveryDataSource = [];
    this.loadDeliveryCarriesByType(model.Type);
  }

  onDeleteDelivery(data: DeliveryCarrierDTO){

    this.isLoading1 = true;
    this.deliveryCarrierV2Service.delete(data.Id).pipe(finalize(() => this.isLoading1 = false))
      .subscribe(res => {
        this.message.success("Thành công");
        this.loadDeliveryCarriesByType(data.DeliveryType);
    }, error => {
        this.message.error(error?.error?.message || "Thao tác thất bại");
    });
  }
}
