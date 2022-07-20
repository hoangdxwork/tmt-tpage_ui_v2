import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { OdataGetOrderPartnerIdModal } from 'src/app/main-app/dto/saleonlineorder/odata-getorderpartnerid.dto';
import { ODataSaleOnline_OrderModel } from 'src/app/main-app/dto/saleonlineorder/odata-saleonline-order.dto';
import { FilterObjLiveOrderModel, OdataGetOrderPartnerIdService } from 'src/app/main-app/services/mock-odata/odata-getorder-partnerid.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { TDSMessageService } from 'tds-ui/message';
import { Message } from 'src/app/lib/consts/message.const';
import { FilterDataRequestDTO, SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { addDays } from 'date-fns';

@Component({
  selector: 'live-order-bypartner',
  templateUrl: './live-order-bypartner.component.html',
})
export class LiveOrderByPartnerComponent implements OnInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @Input() partnerId!: number;
  lstOfData!: ODataSaleOnline_OrderModel[];
  pageSize: number = 1;
  pageIndex: number = 1;
  count: number = 0;
  isLoading: boolean = false;
  isTabNavs: boolean = false;
  lstOrder!: Array<OdataGetOrderPartnerIdModal>;
  destroy$ = new Subject<void>();
  lstStatusTypeExt!: Array<any>;
  indClickTag = "";

  public modelTags: Array<TDSSafeAny> = [];
  public tabNavs: Array<TabNavsDTO> = [];
  public lstDataTag: Array<TDSSafeAny> = [];
  public filterObj: FilterObjLiveOrderModel = {
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
  }
  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  constructor(
    private odataGetOrderPartnerIdService: OdataGetOrderPartnerIdService,
    private tagService: TagService,
    private commonService: CommonService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.loadTags();
    this.loadStatusTypeExt();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    if (this.partnerId) {
      this.lstOrder = [];
      let filters = this.odataGetOrderPartnerIdService.buildFilter(this.filterObj);
      let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);
      console.log(filters)
      this.odataGetOrderPartnerIdService.getOrdersByPartner(this.partnerId, params).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.count = res["@odata.count"];
        this.lstOrder = res.value;
      }, err => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
      })
    }
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
  }

  openTag(id: string, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = "";
  }

  loadStatusTypeExt() {
    this.commonService.getStatusTypeExt().subscribe(res => {
      this.lstStatusTypeExt = [...res];
    });
  }

  getColorStatusText(status: string): TDSTagStatusType {
    let value = this.lstStatusTypeExt?.filter(x => x.Text === status)[0]?.Text;
    switch (value) {
      case "Đơn hàng":
        return "primary";
      case "Nháp":
        return "info";
      case "Hủy":
        return "warning";
      case "Hủy bỏ":
        return "secondary";
      case "Bom hàng":
        return "error";
      case "Đã thanh toán":
        return "success";
      default:
        return "secondary";
    }
  }

  onSearch(data: TDSSafeAny) {
    this.pageIndex = 1;

    this.filterObj.searchText = data.value;
    this.loadData(this.pageSize,this.pageIndex);
  }

}
