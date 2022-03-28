import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib/enum/sort.enum';
import { TCommonService } from 'src/app/lib/services';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OdataFastSaleOrderService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder.service';
import { TDSModalService, TDSSafeAny, TDSHelperObject, TDSHelperString, TDSI18nService, ToastrService, toArray, TDSTableQueryParams } from 'tmt-tang-ui';
import { partnerDto } from '../../partner/partner/partner.component';
import { addDays, getISODay } from 'date-fns/esm';
import { TagService } from 'src/app/main-app/services/tag.service';
import { THelperCacheService } from 'src/app/lib';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})

export class BillComponent implements OnInit{

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 10;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    bill: null,
    deliveryType: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  public tabNavs: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO>= [{
      field: "DateInvoice",
      dir: SortEnum.desc,
  }];

  isOpenMessageFacebook = false
  indClickTag = -1
  tabIndex: number = 1;

  public lstDataTag: Array<TDSSafeAny> = [];
  expandSet = new Set<number>();

  public hiddenColumns: any[] = [];
  public columns: any[] = [
    {value: 'Number', name: 'Số HĐ'},
    {value: 'CRMTeamName', name: 'Kênh kết nối'},
    {value: 'DateInvoice', name: 'Ngày bán'},
    {value: 'PartnerDisplayName', name: 'Khách hàng'},
    {value: 'AmountTotal', name: 'Tổng tiền'},
    {value: 'Residual', name: 'Còn nợ'},
    {value: 'ShowState', name: 'Trạng thái'},
    {value: 'CarrierName', name: 'Đối tác giao hàng'},
    {value: 'TrackingRef', name: 'Mã vận đơn'},
    {value: 'ShipPaymentStatus', name: 'Trạng thái GH'},
    {value: 'CashOnDelivery', name: 'Tiền thu hộ'},
    {value: 'IsRefund', name: 'Đơn hàng trả'},
    {value: 'CustomerDeliveryPrice', name: 'Phí ship giao hàng'}
  ];

  constructor(private modalService: TDSModalService,
    private  odataFastSaleOrderService: OdataFastSaleOrderService,
      private tagService: TagService,
      private fastSaleOrderService :FastSaleOrderService,
      private viewContainerRef: ViewContainerRef){
  }

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  isHidden(columnName: string) {
     return false;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach((x: any) => this.updateCheckedSet(x.Id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly partnerDto[]): void {
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadSummaryStatus();
    this.loadTags();
  }

  loadData() {
    this.isLoading = true;
    let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.odataFastSaleOrderService.getView(params, this.filterObj).subscribe((res: TDSSafeAny) => {

        this.count = res['@odata.count'] as number //260
        this.lstOfData = res.value;






          // Id: _.Id,
          // Number: _.Number,
          // Tags: x.Tags,
          // PartnerDisplayName: x.PartnerDisplayName,
          // PrintDeliveryCount: x.PrintDeliveryCount,
          // PrintShipCount: x.PrintShipCount,
          // CRMTeamName: x.CRMTeamName,
          // DateInvoice: x.DateInvoice,
          // AmountTotal: x.AmountTotal,
          // Residual: x.Residual,
          // PaymentMessageCount: x.PaymentMessageCount,
          // State: x.State,
          // ShowState: x.ShowState,
          // CarrierName: x.CarrierName,
          // TrackingRef: x.TrackingRef,
          // ShipPaymentStatus: x.ShipPaymentStatus,
          // CashOnDelivery: x.CashOnDelivery,
          // IsRefund: x.IsRefund,
          // CustomerDeliveryPrice: x.CustomerDeliveryPrice,

        this.isLoading = false;
    });
  }

  loadSummaryStatus(){
    let model = {
        DateStart: this.filterObj.dateRange.startDate,
        DateEnd: this.filterObj.dateRange.endDate,
        SearchText: this.filterObj.searchText,
        TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
        TrackingRef: this.filterObj.bill,
        DeliveryType: this.filterObj.deliveryType ? this.filterObj.deliveryType.value : null,
    };

    this.fastSaleOrderService.getSummaryStatus(model).subscribe((res: TDSSafeAny) => {
        var total = 0;
        res.map((x: TDSSafeAny) => {
            total = total + x.Total;
            switch(x.Type) {
                case "cancel" :
                    this.tabNavs.push({  Name: "Hủy bỏ", Index: 5, Type: x.Type, Total: x.Total })
                  break;
                case "paid" :
                    this.tabNavs.push({ Name: "Đã thanh toán",  Index: 4, Type: x.Type, Total: x.Total })
                  break;
                case "open" :
                    this.tabNavs.push({ Name: "Đã xác nhận", Index: 3, Type: x.Type, Total: x.Total })
                  break;
                case "draft" :
                    this.tabNavs.push({Name: "Nháp", Index: 2, Type: x.Type, Total: x.Total })
                    break;
                default:
                    break;
            }
        });

        this.tabNavs.push({ Name: "Tất cả",  Type: null, Index: 1,   Total: total });
        this.tabNavs.sort((a, b) => a.Index - b.Index);
    })
  }

  loadTags(){
    let type = "fastsaleorder";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstDataTag = res.value;
    })
  }

  onSelectChange(item: TDSSafeAny) {
    this.tabIndex = item.Index;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj = {
      tags: [],
      status: item.Type,
      bill: '',
      deliveryType: '',
      searchText: '',
      dateRange: {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
      }
    };

    this.loadData();
  }

  onCreate() {}

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = -1
  }

  assignTags(id: number, tags: TDSSafeAny) {
    let model = { OrderId: id, Tags: tags };
    this.fastSaleOrderService.assignTagFastSaleOrder(model)
      .subscribe((res: TDSSafeAny) => {
          var exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if(exits) {
            exits.Tags = JSON.stringify(tags)
          }

          this.indClickTag = -1;
          this.modelTags = [];
    }, error => {
      this.indClickTag = -1;
    });
  }

  applyFilter(event: TDSSafeAny)  {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj.searchText = event.target.value;
    this.loadData();
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj = {
        tags: event.tags,
        status: event.status,
        bill: event.bill,
        deliveryType: event.deliveryType,
        searchText: event.searchText,
        dateRange: {
            startDate: event.dateRange.startDate,
            endDate: event.dateRange.endDate,
        }
    }
    this.loadData();
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }
  closeDrawerMessage(ev: boolean){
    this.isOpenMessageFacebook = false;
  }
  onQueryParamsChange(params: TDSTableQueryParams) {
    //console.log('params',params)
    // this.listSort = params.sort.filter(f=> f.value != null).map(s=>{
    //   return {field:s.key, dir: s.value == 'descend' ? SortEnum.desc  : SortEnum.asc}
    // }).reverse();
    this.loadData();
  }
}
