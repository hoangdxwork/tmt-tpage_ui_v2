import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
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
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';

@Component({
  selector: 'overview-order-bypartner',
  templateUrl: './overview-order-bypartner.component.html',
})
export class OverviewOrderBypartnerComponent implements OnInit, OnDestroy {

  @Input() partnerId!: number;

  pageSize: number = 1;
  pageIndex: number = 1;
  indClickTag = -1;
  count: number = 0;
  isLoading: boolean = false;
  lstOrder!: Array<OdataGetOrderPartnerIdModal>;
  destroy$ = new Subject<void>();
  // filter status
  tabIndex: number = 1;
  public tabNavs: Array<TabNavsDTO> = [];
  public lstOftabNavs: Array<TabNavsDTO> = [];
  lstStatus:TDSSafeAny[] = [];

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

  constructor(
    private odataFastSaleOrderPartnerIdService: OdataFastSaleOrderPartnerIdService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {
    this.loadSummaryStatus();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    if (this.partnerId) {
      this.lstOrder = [];

      let filters = this.odataFastSaleOrderPartnerIdService.buildFilter(this.filterObj);
      let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

      this.odataFastSaleOrderPartnerIdService.getOrdersByPartnerId(this.partnerId, params).subscribe(res => {
        this.count = res["@odata.count"];
        this.lstOrder = [...res.value];
      }, err => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
      })
    }
  }

  loadSummaryStatus() {

    let startDate = new Date(this.filterObj?.dateRange.startDate.setHours(0, 0, 0, 0)).toISOString();
    let endDate = new Date(this.filterObj?.dateRange.endDate).toISOString();

    this.odataFastSaleOrderPartnerIdService.getOverviewOrdersByPartnerId(this.partnerId, startDate, endDate).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      let tabs: TabNavsDTO[] = [];
      this.lstStatus = res.value as any[];

      tabs = this.lstStatus.map((x: any, index: number) => {
        return { Name: x.State, Index: index + 1, Total: x.Count } as TabNavsDTO
      });

      this.tabNavs = [...tabs];
      this.lstOftabNavs = this.tabNavs;
    },
      err => {
        this.message.error(err?.error?.message || Message.CanNotLoadData)
      });
  }

  // filter status
  onSelectChange(index: number) {
    let item = this.tabNavs.find(f => f.Index == index);
    if(item){
      this.filterObj.state = item.Name;
    }

    this.pageIndex = 1;
    this.indClickTag = -1;

    this.loadData(this.pageSize, this.pageIndex);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
