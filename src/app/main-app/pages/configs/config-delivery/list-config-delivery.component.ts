
import { Router } from '@angular/router';
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
  dataType: Array<any> = [];
  providerDataSource: Array<DeliveryDataResponseDto> = [];
  deliveryDataSource: Array<DeliveryCarrierDTO> = [];
  public expandSet = new Set<number>();
  pageSize = 10;
  pageIndex = 1;
  count: number = 0;

  dataItems: any = {};

  @ViewChild('innerText') innerText!: ElementRef;

  constructor(private router: Router,
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
    let skip = this.pageIndex - 1;

    this.deliveryCarrierV2Service.getProviderToAship()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: DeliveryResponseDto<GetDeliveryResponseDto>) => {
        if (res.Success && res.Data) {
          this.providerDataSource = res.Data.Providers;
          this.dataFilter = res.Data.Providers;

          if(this.dataFilter && this.dataFilter.length > 0) {
            this.dataFilter.map(x => {
              let type = x.Type
              this.deliveryCarrierV2Service.getViewByDeliveryType(type, skip, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
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

  changePageIndex(pageIndex:number, index: number){
    if(this.isLoading1) {
      return;
    }
    this.isLoading1 = true;

    let skip = (pageIndex - 1 ) * this.pageSize ;
    let pageSize = this.pageSize * pageIndex;

    this.deliveryCarrierV2Service.getViewByDeliveryType(this.dataFilter[index].Type, skip, pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.dataFilter[index].Values = [...res.value];
        this.dataItems[this.dataFilter[index].Type] = res;

        this.isLoading1 = false;
      },
      error: error => {
        this.isLoading1 = false;

      }
    })
  }

  loadSearchData() {
    let data = this.providerDataSource;
    if(TDSHelperString.hasValueString(this.innerText)) {
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

  onChangeCollapse(index: number, checked: boolean): void {
    this.deliveryDataSource = [];
    this.collapseAllRow();
    if (checked) {
      this.expandSet.add(index);

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

  onInputKeyup(ev:TDSSafeAny){
    this.isLoading = true;
    this.keyFilter = ev.value;
    this.dataFilter = [...this.loadSearchData()];
    this.isLoading = false;
  }
}
