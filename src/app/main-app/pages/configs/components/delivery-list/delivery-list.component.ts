import { Component, Input, OnInit } from '@angular/core';
import { DeliveryCarrierDTO } from '@app/dto/carrier/delivery-carrier.dto';
import { DeliveryCarrierV2Service } from '@app/services/delivery-carrier-v2.service';
import { finalize, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
})
export class DeliveryListComponent implements OnInit {
  @Input() lenght!: number;
  @Input() data: any;
  @Input() typeCollapse!: string;
  pageSize = 10;
  pageIndex = 1;
  dataItems: any = {};
  active: any = null;
  isFilter: string = 'all';
  deliveryDataSource: Array<DeliveryCarrierDTO> = [];
  public expandSet = new Set<number>();
  public lstType: any[] = [
    { id: 'all', name: 'Tất cả' },
    { id: 'active', name: 'Có hiệu lực' },
    { id: 'expire', name: 'Hết hiệu lực' },
  ];
  currentType: any = { id: 'all', name: 'Tất cả' };

  isLoading1: boolean = false;

  constructor(
    private deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.isLoading1) {
      return;
    }
    this.isLoading1 = true;
    let skip = this.pageIndex - 1;

    let params = `top=${this.pageSize}&%24skip=${skip}&%24filter=(DeliveryType+eq+%27${this.data.Type}%27)`;
    if (this.active) {
      params = `top=${this.pageSize}&%24skip=${skip}&%24filter=(Active+eq+${this.active}+and+DeliveryType+eq+%27${this.data.Type}%27)`;
    }

    this.deliveryCarrierV2Service.getViewByDeliveryType(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data.Values = [...res.value];
        this.dataItems[this.data.Type] = res;
        this.isLoading1 = false;
      },
      error: error => {
        this.isLoading1 = false;
      }
    })
  }

  changePageIndex(pageIndex: number) {
    if (this.isLoading1) {
      return;
    }
    this.isLoading1 = true;
    this.pageIndex = pageIndex;

    let skip = (pageIndex - 1) * this.pageSize;
    let pageSize = this.pageSize * pageIndex;
    let params = `top=${pageSize}&%24skip=${skip}&%24filter=(DeliveryType+eq+%27${this.data.Type}%27)`;
    if (this.active) {
      params = `top=${pageSize}&%24skip=${skip}&%24filter=(Active+eq+${this.active}+and+DeliveryType+eq+%27${this.data.Type}%27)`;
    }

    this.deliveryCarrierV2Service.getViewByDeliveryType(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data.Values = [...res.value];
        this.dataItems[this.data.Type] = res;
        this.isLoading1 = false;
      },
      error: error => {
        this.isLoading1 = false;
      }
    })
  }

  onChangeCollapse(index: number, checked: boolean): void {
    this.deliveryDataSource = [];
    this.collapseAllRow(index);
    if (checked) {
      this.expandSet.add(index);
    } else {
      this.expandSet.delete(index);
    }
  }

  private collapseAllRow(index: number) {
    this.expandSet.clear();
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

  onFilter(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  onChangeType(event: any) {
    if (event) {
      this.pageIndex = 1;
      this.currentType = this.lstType.find(x => x.id === event.id);

      if (event.id == "all") {
        this.active = null;
        this.isFilter = "all";
      }
      if (event.id == "active") {
        this.active = "true";
        this.isFilter = "active";
      }
      if (event.id == "expire") {
        this.active = "false";
        this.isFilter = "expire";
      }
      this.loadData()
    }
  }

  onDeleteDelivery(data: DeliveryCarrierDTO) {

    this.isLoading1 = true;
    this.deliveryCarrierV2Service.delete(data.Id).pipe(finalize(() => this.isLoading1 = false))
      .subscribe(res => {
        this.message.success("Thành công");
        this.loadDeliveryCarriesByType(data.DeliveryType);
      }, error => {
        this.message.error(error?.error?.message || "Thao tác thất bại");
      });
  }

  onActiveChange(event: boolean) {
    if(event) {
      this.typeCollapse = this.data.Type;
    } else {
      this.typeCollapse = '';
    }
  }


}
