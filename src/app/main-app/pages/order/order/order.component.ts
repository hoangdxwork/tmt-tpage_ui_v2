import { addDays } from 'date-fns/esm';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SaleOnlineOrderSummaryStatusDTO, SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSSafeAny, TDSTableQueryParams, TDSTagStatusType } from 'tmt-tang-ui';
import { ColumnTableDTO } from 'src/app/main-app/dto/common/table.dto';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { EditOrderComponent } from '../components/edit-order/edit-order.component';
import { CreateBillFastComponent } from '../components/create-bill-fast/create-bill-fast.component';
import { CreateBillDefaultComponent } from '../components/create-bill-default/create-bill-default.component';
import { Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  private _destroy = new Subject<void>();

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Code', name: 'Code', isChecked: true },
    { value: 'Name', name: 'Tên', isChecked: true },
    { value: 'CRMTeamName', name: 'Kênh kết nối', isChecked: true },
    { value: 'Address', name: 'Địa chỉ', isChecked: false },
    { value: 'TotalAmount', name: 'Tổng tiền', isChecked: true },
    { value: 'TotalQuantity', name: 'Tổng SL', isChecked: true },
    { value: 'StatusText', name: 'Trạng thái', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: false }
  ];

  public tabNavs: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  tabIndex: number = 1;

  public lstDataTag: Array<TDSSafeAny> = [];

  // '097', '098', '038', '039', '037', '035', '034',
  // 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel',
  firstPhone = ['036', '090', '093', '077', '082']
  namePhone = ['Viettel',  'Mobifone', 'Mobifone', 'Mobifone', 'Vinaphone']

  expandSet = new Set<string>();
  isOpenMessageFacebook = false;
  indClickTag = "";

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  constructor(
    private tagService: TagService,
    private router: Router,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService,
    private cacheApi: THelperCacheService,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit(): void {
    this.loadTags();
    this.loadGridConfig();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    console.log(this.setOfCheckedId);
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach(item => this.updateCheckedSet(item.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.lstOfData.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataSaleOnline_OrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;

    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));

    this.loadSummaryStatus();
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.odataSaleOnline_OrderService
        .getView(params, this.filterObj)
        .pipe(finalize(() => this.isLoading = false ));
  }

  loadSummaryStatus() {
    let model : SaleOnlineOrderSummaryStatusDTO = {
      dateStart: this.filterObj.dateRange.startDate,
      dateEnd: this.filterObj.dateRange.endDate,
      searchText: this.filterObj.searchText,
      tagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
    }

    this.isLoading = true;
    this.saleOnline_OrderService.getSummaryStatus(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: Array<TDSSafeAny>) => {
        let total = 0;

        this.tabNavs.length = 0;

        res.map((x: TDSSafeAny) => {
          total += x.Total;
          switch(x.StatusText) {
            case "Nháp" :
              this.tabNavs.push({ Name: "Nháp", Index: 2, Total: x.Total });
              break;
            case "Đã xác nhận" :
              this.tabNavs.push({ Name: "Đã xác nhận", Index: 3, Total: x.Total });
              break;
            case "Đơn hàng" :
              this.tabNavs.push({ Name: "Đơn hàng", Index: 3, Total: x.Total });
              break;
            case "Đã thanh toán" :
              this.tabNavs.push({ Name: "Đã thanh toán", Index: 4, Total: x.Total });
              break;
            case "Hủy" :
              this.tabNavs.push({ Name: "Hủy", Index: 5, Total: x.Total });
              break;
          }
        });

        this.tabNavs.push({ Name: "Tất cả", Index: 1, Total: total });
        this.tabNavs.sort((a, b) => a.Index - b.Index);
      });
  }

  loadGridConfig() {
    const key = this.saleOnline_OrderService._keyCacheGrid;
    this.cacheApi.getItem(key).subscribe((res: TDSSafeAny) => {
      if(res && res.value) {
        let jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    });
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstDataTag = res.value;
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onCreateBillFast() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      this.modal.create({
        title: 'Tạo hóa đơn nhanh',
        content: CreateBillFastComponent,
        centered: true,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: ids,
        }
      });
    }
  }

  onCreateBillDefault() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      this.modal.create({
        title: 'Tạo hóa đơn với sản phẩm mặc định',
        content: CreateBillDefaultComponent,
        centered: true,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: ids,
        }
      });
    }
  }

  onUrlCreateInvoiceFast() {
    this.router.navigateByUrl(`bill/create`);
  }

  checkPhone(phone: string) {
    if(TDSHelperString.hasValueString(phone)) {
      for (let i = 0; i < this.firstPhone.length; i++) {
        if (phone.indexOf(this.firstPhone[i]) == 0)
          return this.namePhone[i];
      }
    }

    return 'Chưa xác định';
  }

  onSelectChange(Index: TDSSafeAny) {
    const dataItem =  this.tabNavs.find(f =>{ return f.Index == Index })
    this.pageIndex = 1;
    this.indClickTag = "";

    this.filterObj = {
      tags: [],
      status: dataItem?.Name != 'Tất cả' ? dataItem?.Name : null,
      searchText: '',
      dateRange: {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
      }
    };

    this.loadData(this.pageSize, this.pageIndex);
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }

  openTag(id: string, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = "";
  }

  assignTags(id: number, tags: TDSSafeAny) {
    let model = { OrderId: id, Tags: tags };
    this.saleOnline_OrderService.assignSaleOnlineOrder(model)
      .subscribe((res: TDSSafeAny) => {
        if(res && res.OrderId) {
          let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if(exits) {
            exits.Tags = JSON.stringify(tags)
          }

          this.indClickTag = "";
          this.modelTags = [];
          this.message.success(Message.Tag.InsertSuccess);
        }

    }, error => {
      this.indClickTag = "";
      this.message.error(`${error?.error?.message}` || Message.Tag.InsertFail);
    });
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đơn hàng":
        return "success";
      case "Hủy":
        return "error";
      default:
        return "warning";
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
  }

  applyFilter(event: TDSSafeAny)  {
    this.tabIndex = 1;
    this.pageIndex = 1;

    this.filterObj.searchText = event.target.value;
    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;
    this.indClickTag = "";

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.filterObj = {
      tags: [],
      status: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  // Refresh nhưng không refresh lại Tab, Index
  refreshDataCurrent() {
    this.indClickTag = "";

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.loadData(this.pageSize, this.pageIndex);
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj = {
      tags: event.tags,
      status: event?.status != 'Tất cả' ? event?.status : null,
      searchText: event.searchText,
      dateRange: {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate,
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if(event && event.length > 0) {
      const gridConfig = {
          columnConfig: event
      };

      const key = this.saleOnline_OrderService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  onEdit(id: string) {
    const modal = this.modal.create({
      title: 'Sửa đơn hàng',
      content: EditOrderComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        idOrder: id
      }
    });

    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe((result: TDSSafeAny) => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  onRemove(id: string, code: string) {
    this.modal.error({
      title: 'Xóa đơn hàng',
      content: 'Bạn có chắc muốn xóa đơn hàng',
      onOk: () => this.remove(id, code),
      onCancel:()=>{console.log('cancel')},
      okText:"Xóa",
      cancelText:"Hủy"
    });
  }

  remove(id: string, code: string) {
    this.isLoading = true;
    this.saleOnline_OrderService.remove(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: TDSSafeAny) => {
        this.message.info(`${Message.Order.DeleteSuccess} ${code}`);
        this.refreshDataCurrent();
      }, error => this.message.error(`${error?.error?.message}` || Message.ErrorOccurred));
  }

  checkValueEmpty() {
    let ids = [...this.setOfCheckedId];

    if (ids.length == 0) {
      this.message.error(Message.SelectOneLine);
      return 0;
    }

    return 1;
  }

  onExportExcel() {
    let filter = {
      logic: 'and',
      filters: [
        {
          field: "DateCreated",
          operator: "gte",
          value: addDays(new Date(), -30).toISOString()
        },
        {
          field: "DateCreated",
          operator: "lte",
          value: new Date().toISOString()
        }
    ]};

    let model = {
      data: JSON.stringify({Filter: filter}),
      ids: [...this.setOfCheckedId]
    }

    this.excelExportService.exportPost(`/SaleOnline_Order/ExportFile`, model,`don_hang_online`);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

}
