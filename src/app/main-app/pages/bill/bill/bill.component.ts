import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib/enum/sort.enum';
import { TCommonService } from 'src/app/lib/services';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OdataFastSaleOrderService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder.service';
import { TDSModalService, TDSSafeAny, TDSHelperObject, TDSHelperString, TDSI18nService, ToastrService, toArray, TDSTableQueryParams, TDSHelperArray, TDSMessageService } from 'tmt-tang-ui';
import { addDays, getISODay } from 'date-fns/esm';
import { TagService } from 'src/app/main-app/services/tag.service';
import { THelperCacheService } from 'src/app/lib';
import { ColumnTableDTO } from '../components/config-column/config-column.component';
import { Router } from '@angular/router';
import { FastSaleOrderDTO, FastSaleOrderSummaryStatusDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/bill/bill.dto';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})

export class BillComponent implements OnInit{

  lstOfData: Array<FastSaleOrderDTO> = [];
  pageSize = 20;
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

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    {value: 'Number', name: 'Số HĐ', isChecked: true},
    {value: 'CRMTeamName', name: 'Kênh kết nối', isChecked: true},
    {value: 'DateInvoice', name: 'Ngày bán', isChecked: true},
    {value: 'DateCreated', name: 'Ngày tạo', isChecked: true},
    {value: 'PartnerDisplayName', name: 'Khách hàng', isChecked: true},
    {value: 'AmountTotal', name: 'Tổng tiền', isChecked: true},
    {value: 'Residual', name: 'Còn nợ', isChecked: true},
    {value: 'ShowState', name: 'Trạng thái', isChecked: true},
    {value: 'CarrierName', name: 'Đối tác giao hàng', isChecked: true},
    {value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true},
    {value: 'ShipPaymentStatus', name: 'Trạng thái GH', isChecked: false},
    {value: 'CashOnDelivery', name: 'Tiền thu hộ', isChecked: false},
    {value: 'IsRefund', name: 'Đơn hàng trả', isChecked: false},
    {value: 'CustomerDeliveryPrice', name: 'Phí ship giao hàng', isChecked: false},
    {value: 'UserName', name: 'Nhân viên', isChecked: false},
    {value: 'CreateByName', name: 'Người lập', isChecked: false},
  ];

  public tabNavs: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO>= [{
      field: "DateInvoice",
      dir: SortEnum.desc,
  }];

  isOpenMessageFacebook = false;
  indClickTag = -1
  tabIndex: number = 1;

  public lstDataTag: Array<TDSSafeAny> = [];
  expandSet = new Set<number>();

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor( private  odataFastSaleOrderService: OdataFastSaleOrderService,
      private tagService: TagService,
      private router: Router,
      private modal: TDSModalService,
      private cacheApi: THelperCacheService,
      private message: TDSMessageService,
      private fastSaleOrderService :FastSaleOrderService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    //this.loadData();
    this.loadSummaryStatus();
    this.loadTags();

    this.loadGridConfig();
  }

  loadGridConfig() {
    const key = this.fastSaleOrderService._keyCacheGrid;
    this.cacheApi.getItem(key).subscribe((res: TDSSafeAny) => {
      if(res && res.value) {
        var jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    })
  }

  isHidden(columnName: string) {
      return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if(event && event.length > 0) {
      const gridConfig = {
          columnConfig: event
      };

      const key = this.fastSaleOrderService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
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

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  loadData(pageSize : number, pageIndex: number) {
    this.isLoading = true;
    let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.odataFastSaleOrderService.getView(params, this.filterObj).subscribe((res: ODataFastSaleOrderDTO) => {

        this.count = res['@odata.count'] as number //260
        this.lstOfData = res.value;
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

    this.fastSaleOrderService.getSummaryStatus(model).subscribe((res: Array<FastSaleOrderSummaryStatusDTO>) => {
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

  onSelectChange(Index: TDSSafeAny) {
    // this.tabIndex = item.Index;
    const dataItem =  this.tabNavs.find(f =>{ return f.Index == Index })
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: [],
      status: dataItem?.Type,
      bill: '',
      deliveryType: '',
      searchText: '',
      dateRange: {
          startDate: addDays(new Date(), -30),
          endDate: new Date()
      }
    };

    this.loadData(this.pageSize, this.pageIndex);
  }

  onCreate() {
      this.router.navigateByUrl('bill/create');
  }

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
        if(res && res.OrderId) {
          var exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if(exits) {
            exits.Tags = JSON.stringify(tags)
          }

          this.indClickTag = -1;
          this.modelTags = [];
          this.message.success('Gán nhãn thành công!');
        }

    }, error => {
      this.indClickTag = -1;
      this.message.error('Gán nhãn thất bại!');
    });
  }

  applyFilter(event: TDSSafeAny)  {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.searchText = event.target.value;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

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
    this.loadData(this.pageSize, this.pageIndex);
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }

  closeDrawerMessage(ev: boolean){
    this.isOpenMessageFacebook = false;
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
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

    this.loadData(this.pageSize, this.pageIndex);
  }

  onView(data: any) {
    this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  onDelete(data: any) {
    this.modal.success({
      title: 'Xóa hóa đơn',
      content: 'Bạn có muốn xóa hóa đơn',
      onOk: () => {
        this.fastSaleOrderService.delete(data.Id).subscribe(() => {
            this.message.success('Xóa hóa đơn thành công!');
            this.loadData(this.pageSize, this.pageIndex);
        }, error => {
            this.message.error(`${error?.error?.message}`);
        })
      },
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }
}
