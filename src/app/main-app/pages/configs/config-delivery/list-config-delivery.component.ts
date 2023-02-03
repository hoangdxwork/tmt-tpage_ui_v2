import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { DeliveryDataResponseDto, GetDeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/get-delivery.dto';
import { DeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { TDSMessageService } from 'tds-ui/message';
import { finalize, takeUntil } from 'rxjs';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'list-config-delivery',
  templateUrl: './list-config-delivery.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})

export class ListConfigDeliveryComponent implements OnInit {
  isLoading: boolean = false;
  isLoading1: boolean = false;
  keyFilter: string = '';
  dataFilter: Array<DeliveryDataResponseDto> = [];
  type: Array<any> = [];
  providerDataSource: Array<DeliveryDataResponseDto> = [];
  deliveryDataSource: Array<DeliveryCarrierDTO> = [];
  pageSize = 10;
  pageIndex = 1;
  dataItems: any = {};
  typeCollapse!: string;

  @ViewChild('innerText') innerText!: ElementRef;

  constructor(
    private deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
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
          this.dataFilter = res.Data.Providers;

          if (this.dataFilter && this.dataFilter.length > 0) {
            this.dataFilter.map(x => {
              let type = x.Type

              let skip = this.pageIndex - 1;
              let params = `top=${this.pageSize}&%24skip=${skip}&%24filter=(DeliveryType+eq+%27${type}%27)`;

              this.deliveryCarrierV2Service.getViewByDeliveryType(params).pipe(takeUntil(this.destroy$)).subscribe({
                next: (res: any) => {
                  x.Values = [...res.value];
                  this.dataItems[x.Type] = res
                },
                error: error => {
                  this.message.error(res.Error?.Message)
                }
              })
            })
          }
        } else {
          this.message.error(res.Error?.Message);
        }
      });
  }

  loadSearchData() {
    let data = this.providerDataSource;

    if (TDSHelperString.hasValueString(this.innerText)) {
      this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter.trim());
    }

    data = data.filter((x: DeliveryDataResponseDto) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
      (x.Type && TDSHelperString.stripSpecialChars(x.Type.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1))

    return data;
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

  refreshDataDelivery(model: DeliveryDataResponseDto) {
    this.deliveryDataSource = [];
    this.loadDeliveryCarriesByType(model.Type);
  }

  onInputKeyup(ev: TDSSafeAny) {
    this.isLoading = true;
    this.keyFilter = ev.value;
    this.dataFilter = [...this.loadSearchData()];
    this.isLoading = false;
  }

  closeSearchProduct(){
    this.keyFilter = '';
    this.loadData();
  }

  openCollapse(type: string) {
    this.typeCollapse = type;
  }
}
