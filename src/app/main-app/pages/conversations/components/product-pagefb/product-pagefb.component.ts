import { AfterViewInit, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
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

export class ProductPagefbComponent implements AfterViewInit, OnDestroy {

  @ViewChild('innerText') innerText!: ElementRef;
  @Input() pageId: any;

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
    private modal: TDSModalRef) { }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters || null);

    this.getViewData(params).subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
    }, error => {
        this.message.error('Tải dữ liệu khách hàng thất bại!');
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
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((text: TDSSafeAny) => {
        this.pageIndex = 1;
        this.filterObj.searchText = text;

        let filters = this.odataProductService.buildFilter(this.filterObj || null);
        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters || null);
        return this.getViewData(params);
      }))
      .subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
      }, error => {
          this.message.error('Tìm kiếm không thành công');
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

    let model = {
      Id: item.Id,
      Name: item.Name,
      Picture: item.ImageUrl,
      Price: item.Price,
    } as any;

    this.modal.destroy(model);
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
