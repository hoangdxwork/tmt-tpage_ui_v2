import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { addDays } from 'date-fns';
import { map, mergeMap, Subject, takeUntil, finalize, Observable } from 'rxjs';
import { SortEnum } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { OdataGetOrderPartnerIdModal } from 'src/app/main-app/dto/fastsaleorder/odata-getorderpartnerid.dto';
import { FilterObjFastSaleOrderModel, OdataFastSaleOrderPartnerIdService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder-partnerid.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { Message } from 'src/app/lib/consts/message.const';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { QuickSaleOnlineOrderModel } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Router } from '@angular/router';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'overview-order-bypartner',
  templateUrl: './overview-order-bypartner.component.html',
  providers: [TDSDestroyService]
})
export class OverviewOrderBypartnerComponent implements OnInit {

  @Input() quickOrderModel!: QuickSaleOnlineOrderModel;
  @Output() routerEvent = new EventEmitter();
  pageSize: number = 10;
  pageIndex: number = 1;
  indClickTag = -1;
  count: number = 0;
  isLoading: boolean = false;
  lstOrder!: Array<OdataGetOrderPartnerIdModal>;
  tabIndex: number = 1;
  datePicker: any = [addDays(new Date(), -30), new Date()];
  public tabNavs: Array<any> = [];

  public filterObj: FilterObjFastSaleOrderModel = {
    state: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
  }

  sort: Array<SortDataRequestDTO> = [{
    field: "DateInvoice",
    dir: SortEnum.desc,
  }];

  constructor(private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private router: Router,
    private odataFastSaleOrderPartnerIdService: OdataFastSaleOrderPartnerIdService,
    private modalRef: TDSModalRef,
    ) { }

  ngOnInit(): void {
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let startDate = new Date(this.filterObj?.dateRange?.startDate.setHours(0, 0, 0, 0)).toISOString();
    let endDate = new Date(this.filterObj?.dateRange?.endDate).toISOString();

    if (this.quickOrderModel?.PartnerId) {

      this.tabNavs = [];
      this.lstOrder = [];

      this.odataFastSaleOrderPartnerIdService.getOverviewOrdersByPartnerId(this.quickOrderModel?.PartnerId, startDate, endDate)
        .pipe(map((x): any => {

          if (x && x.value) {
            x.value.map((x: any, index: number) => {
              let item = {
                Name: x.ShowState,
                State: x.State,
                Index: index + 1,
                Total: x.Count
              } as any;

              this.tabNavs.push(item);
            });

            return this.tabNavs;
          }
        }), mergeMap((tabNavs): any => {
          if (tabNavs) {
            let state = null;

            let exist = this.tabNavs.filter(x => x.State === 'draft')[0];
            if (exist) {
              state = exist.State;
            } else {
              state = tabNavs[0].State;
            }

            this.filterObj.state = state;
          }

          return this.getView(pageSize, pageIndex);

        })).subscribe((res: any) => {
          this.count = res["@odata.count"];
          this.lstOrder = [...res.value];
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        })
    }
  }

  getView(pageSize: number, pageIndex: number): Observable<any> {
    let filters = this.odataFastSaleOrderPartnerIdService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    return this.odataFastSaleOrderPartnerIdService.getOrdersByPartnerId(this.quickOrderModel?.PartnerId, params).pipe(takeUntil(this.destroy$))
  }

  // filter status
  onSelectChange(index: number) {
    let item = this.tabNavs.find(f => f.Index == index);
    if (item) {
      this.filterObj.state = item.State;
    }

    this.pageIndex = 1;
    this.indClickTag = -1;

    this.isLoading = true;
    this.getView(this.pageSize, this.pageIndex).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.count = res["@odata.count"];
      this.lstOrder = [...res.value];

      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.message.error(err?.error?.message || Message.CanNotLoadData);
    })
  }

  onBillDetail(event: any, data: OdataGetOrderPartnerIdModal) {
    event.preventDefault();
    event.stopImmediatePropagation();
    // this.routerEvent.emit(`bill/detail/${data.Id}`);
    this.modalRef.destroy(null);
    return this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  onSearch(data: TDSSafeAny) {
    this.pageIndex = 1;

    this.filterObj.dateRange = {
      startDate: this.datePicker[0],
      endDate: this.datePicker[1]
    }
    this.filterObj.searchText = data.value;
    this.loadData(this.pageSize,this.pageIndex);
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
    }
    this.onSearch(event);
  }

}
