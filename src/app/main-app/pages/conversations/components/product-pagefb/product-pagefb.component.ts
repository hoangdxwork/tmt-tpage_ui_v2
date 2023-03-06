import { AddTemplateMessageWithProductDto } from '@app/dto/crm-activityv2/addtemplate-message-v2.dto';
import { CRMActivityV2Service } from './../../../../services/crm-activity-v2.service';
import { AfterViewInit, ElementRef, Input, OnDestroy, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { fromEvent, Observable, Subject } from 'rxjs';
import { TDSTableQueryParams } from 'tds-ui/table';
import { OdataProductService } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TDSMessageService } from 'tds-ui/message';
import { switchMap, finalize } from 'rxjs/operators';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'product-pagefb',
  templateUrl: './product-pagefb.component.html',
})

export class ProductPagefbComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('innerText') innerText!: ElementRef;
  @Input() pageId: any;
  @Input() userId!: string;

  lstOfData: any[] = [];
  destroy$ = new Subject<void>();

  pageSize: number = 10;
  pageIndex: number = 1;
  count: number = 0;
  public filterObj: TDSSafeAny = {
    searchText: ''
  }

  isLoading: boolean = false;
  sortOptions: any[] = [
    { value: "count", text: "Sử dụng nhiều nhất" },
    { value: "recent", text: "Sử dụng gần nhất" },
  ];

  currentSort = "count";
  objProduct: TDSSafeAny = {};

  constructor( private odataProductService: OdataProductService,
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private crmActivityV2Service: CRMActivityV2Service,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters || null);

    this.getViewData(params).subscribe({
      next: (res: any) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...res.value];

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
    });
  }

  private getViewData(params: string): Observable<any> {
    this.isLoading = true;

    return this.odataProductService
      .getProductOnFacebookPage(params, this.pageId)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  ngAfterViewInit(): void {
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750), distinctUntilChanged(),
      switchMap((text: TDSSafeAny) => {

        this.pageIndex = 1;
        this.filterObj.searchText = text;

        let filters = this.odataProductService.buildFilter(this.filterObj || null);
        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters || null);
        return this.getViewData(params);
      }))
      .subscribe({
        next: (res: any) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = [...res.value];
        },
        error: (error: any) => {
            this.message.error(`${error?.error?.message}`);
        }
      });
  }

  switchSort(value: string) {
    let getLSTProduct = JSON.parse(localStorage.getItem("ListProduct") || "{}");
    var temps = this.lstOfData.sort((a, b) => {
      if (value === "count") {
        return (
          (getLSTProduct[b.Id] || { TotalView: 0 }).TotalView -
          (getLSTProduct[a.Id] || { TotalView: 0 }).TotalView
        );
      } else {
        return (
          Date.parse(
            (getLSTProduct[b.Id] || { LastViewDate: "200-01-01" }).LastViewDate
          ) -
          Date.parse(
            (getLSTProduct[a.Id] || { LastViewDate: "200-01-01" }).LastViewDate
          )
        );
      }
    });
    this.lstOfData = [...[], ...temps];
    this.currentSort = value;
  }

  onPushItem(item: any) {
    if(this.isLoading) return;

    if(!this.pageId) {
      this.message.error('Không tìm thấy pageId');
      return 
    }

    if(!this.userId) {
      this.message.error('Không tìm thấy userId');
      return
    }

    let getLSTProduct = JSON.parse(localStorage.getItem("ListProduct") || "{}");

    if (getLSTProduct == null) {
      this.objProduct[item.Id] = {
        TotalView: 1,
        LastViewDate: new Date(),
      };
      localStorage.setItem("ListProduct", JSON.stringify(this.objProduct));
    } else {
      let findIndex = getLSTProduct[item.Id];
      if (findIndex === undefined) {
        getLSTProduct[item.Id] = {
          TotalView: 1,
          LastViewDate: new Date(),
        };
      } else {
        findIndex.TotalView = findIndex.TotalView + 1;
        findIndex.LastViewDate = new Date();
      }
      localStorage.setItem("ListProduct", JSON.stringify(getLSTProduct));
    }
    
    let model = this.prepareModelProduct(item);

    this.isLoading = true;

    this.crmActivityV2Service.addTemplateMessageWithProduct(this.pageId, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res : TDSSafeAny) => {
        this.isLoading = false;
        this.message.success('Gửi sản phẩm thành công');

        this.cdRef.detectChanges();
      },
      error: (error: TDSSafeAny) => {
        this.isLoading = false;
        this.message.error(error?.error?.message);

        this.cdRef.detectChanges();
      }
    })
  }

  prepareModelProduct(item: TDSSafeAny) {
    let msg = '';
    if(item.Name && item.ListPrice){
      let price = item.ListPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      msg = `Đã gửi một sản phẩm: ${item.Name} (Đơn giá: ${price}).`;
    }

    let model = {
      message: msg,
      page_id: this.pageId,
      to_id: this.userId , // UserId
      comment_id: null,
      product: {
          Id: item.Id, // Id hóa đơn
          Name: item.Name,
          Description: item.Description,
          Picture: item.ImageUrl,
          Price: item.Price
      }
    } as AddTemplateMessageWithProductDto
    return model;
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.innerText.nativeElement.value = '';

    this.loadData(this.pageSize, this.pageIndex);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.modal.destroy(null);
  }

}
