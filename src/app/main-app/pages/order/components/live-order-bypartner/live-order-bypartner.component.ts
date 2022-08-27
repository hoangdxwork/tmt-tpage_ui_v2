import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';

@Component({
  selector: 'live-order-bypartner',
  templateUrl: './live-order-bypartner.component.html',
})
export class LiveOrderByPartnerComponent implements OnInit, OnDestroy {

  @ViewChild('innerText') innerText!: ElementRef;
  @Input() partnerId!: number;
  @Input() orderId! : string | undefined;
  @Output() checkedClick = new EventEmitter<boolean>();
  checked : boolean = false;
  datePicker: any = [addDays(new Date(), -30), new Date()];
  // lstOfData!: ODataSaleOnline_OrderModel[];
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  isLoading: boolean = false;
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
    private message: TDSMessageService,
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
    this.isLoading = true;
    if (this.partnerId) {
      this.lstOrder = [];
      let filters = this.odataGetOrderPartnerIdService.buildFilter(this.filterObj);
      let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

      this.odataGetOrderPartnerIdService.getOrdersByPartner(this.partnerId, params).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.count = res["@odata.count"];
        this.lstOrder = res.value;
        this.isLoading = false;
      }, err => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
        this.isLoading = false;
      })
    }
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
  }

  // openTag(id: string, data: TDSSafeAny) {
  //   this.modelTags = [];
  //   this.indClickTag = id;
  //   this.modelTags = JSON.parse(data);
  // }

  // assignTags(id: string, tags: TDSSafeAny) {
  //   let model = { OrderId: id, Tags: tags };
  //   this.odataGetOrderPartnerIdService.assignSaleOnlineOrder(model)
  //     .subscribe((res: TDSSafeAny) => {
  //       if (res && res.OrderId) {
  //         let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
  //         if (exits) {
  //           exits.Tags = JSON.stringify(tags)
  //         }

  //         this.indClickTag = "";
  //         this.modelTags = [];
  //         this.message.success(Message.Tag.InsertSuccess);
  //       }
  //     }, error => {
  //       this.indClickTag = "";
  //       this.message.error(`${error?.error?.message}` || Message.Tag.InsertFail);
  //     });
  // }

  // closeTag(): void {
  //   this.indClickTag = "";
  // }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
    }
    this.onSearch(event);
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

    this.filterObj.dateRange = {
      startDate: this.datePicker[0],
      endDate: this.datePicker[1]
    }
    this.filterObj.searchText = data.value;
    this.loadData(this.pageSize,this.pageIndex);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeClick(ev: TDSSafeAny){
    if(ev == this.orderId) {
      this.checkedClick.emit(!this.checked);
    }
  }

}
