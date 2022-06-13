import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib/enum/sort.enum';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OdataFastSaleOrderService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder.service';
import { TDSModalService, TDSSafeAny, TDSHelperString, TDSTableQueryParams, TDSMessageService, TDSResizeObserver } from 'tmt-tang-ui';
import { addDays } from 'date-fns/esm';
import { TagService } from 'src/app/main-app/services/tag.service';
import { THelperCacheService } from 'src/app/lib';
import { ColumnTableDTO } from '../components/config-column/config-column.component';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { FastSaleOrderDTO, FastSaleOrderSummaryStatusDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html'
})

export class BillComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild('WidthTable') widthTable!: ElementRef;
  @ViewChild('BillOrderLines') billOrderLines!: ElementRef;

  lstOfData: Array<FastSaleOrderDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  widthCollapse: number = 0;
  paddingCollapse: number = 36;
  marginLeftCollapse: number = 0;

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

  public lstShipStatus: any[] = [
    {value:'none', text:'Chưa tiếp nhận'},
    {value:'refund', text:'Hàng trả về'},
    {value:'other', text:'Đối soát không thành công'},
    {value:'sent', text:'Đã tiếp nhận'},
    {value:'cancel', text:'Hủy bỏ'},
    {value:'done', text:'Đã thu tiền'},
    {value:'done_and_refund', text:'Đã thu tiền và trả hàng về'}
  ]

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    {value: 'Number', name: 'Số HĐ', isChecked: true},
    {value: 'PartnerDisplayName', name: 'Khách hàng', isChecked: true},
    {value: 'CRMTeamName', name: 'Thông tin', isChecked: true},
    {value: 'DateCreated', name: 'Ngày tạo đơn', isChecked: true},
    {value: 'CarrierName', name: 'Đối tác giao hàng', isChecked: true},
    {value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true},
    {value: 'AmountTotal', name: 'Tổng tiền', isChecked: true},
    {value: 'Residual', name: 'Còn nợ', isChecked: true},
    {value: 'ShowState', name: 'Trạng thái', isChecked: true},
    {value: 'ShowShipStatus', name: 'Đối soát GH', isChecked: true},
    {value: 'ShipPaymentStatus', name: 'Trạng thái GH', isChecked: false},
    {value: 'DateInvoice', name: 'Ngày bán', isChecked: false},
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

  indClickStatus = -1;
  currentStatus:TDSSafeAny;

  public lstTags: Array<TDSSafeAny> = [];
  expandSet = new Set<number>();

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  private destroy$ = new Subject<void>();

  constructor( private  odataFastSaleOrderService: OdataFastSaleOrderService,
      private tagService: TagService,
      private router: Router,
      private modal: TDSModalService,
      private cacheApi: THelperCacheService,
      private message: TDSMessageService,
      private fastSaleOrderService :FastSaleOrderService,
      private resizeObserver: TDSResizeObserver) {
  }

  ngOnInit(): void {
    this.loadSummaryStatus();
    this.loadTags();
    this.loadGridConfig();
  }

  loadGridConfig() {
    const key = this.fastSaleOrderService._keyCacheGrid;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
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
    let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: ODataFastSaleOrderDTO) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;
    }, error => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
    });
  }

  private getViewData(params: string): Observable<ODataFastSaleOrderDTO> {
    this.isLoading = true;
    return this.odataFastSaleOrderService
        .getView(params, this.filterObj).pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => {this.isLoading = false }));
  }

  loadSummaryStatus(){
    this.tabNavs = [];
    let model = {
        DateStart: this.filterObj.dateRange.startDate,
        DateEnd: this.filterObj.dateRange.endDate,
        SearchText: TDSHelperString.stripSpecialChars(this.filterObj.searchText.trim()) ,
        TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
        TrackingRef: this.filterObj.bill,
        DeliveryType: this.filterObj.deliveryType ? this.filterObj.deliveryType.value : null,
    };

    this.fastSaleOrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$)).subscribe((res: Array<FastSaleOrderSummaryStatusDTO>) => {
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
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    })
  }

  exportExcel(type:string){
    switch(type){
      case 'excel':

        let model = {
          ids: [],
          data: {

          }
        }
    }
  }

  onSelectChange(Index: TDSSafeAny) {
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
    this.indClickTag = -1;
  }

  assignTags(id: number, tags: TDSSafeAny) {
    let model = { OrderId: id, Tags: tags };
    this.fastSaleOrderService.assignTagFastSaleOrder(model).pipe(takeUntil(this.destroy$))
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

  openShipStatus(data:FastSaleOrderDTO, dataId:number){
    this.indClickStatus = dataId;
    this.currentStatus = {
      value: data.ShipStatus,
      text: data.ShowShipStatus
    }
  }

  changeShipStatus(status: TDSSafeAny) {
    this.currentStatus = status;
  }

  closeShipStatus(): void {
    this.indClickStatus = -1;
  }

  assignShipStatus(dataId: number){
    if(this.currentStatus){
      let model = { id:dataId, status:this.currentStatus.value };
      this.fastSaleOrderService.updateShipStatus(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.message.success('Cập nhật thành công');
          this.loadData(this.pageSize,this.pageIndex);
          this.indClickStatus = -1;
        },
        err=>{
          this.message.error('Cập nhật thất bại');
          this.indClickStatus = -1;
        }
      )
    }else{
      this.message.error('Vui lòng chọn đối soát giao hàng');
    }
  }

  ngAfterViewInit(): void {
    this.widthCollapse = this.widthTable.nativeElement.offsetWidth - this.paddingCollapse
    this.resizeObserver
      .observe(this.widthTable)
      .subscribe(() => {
        this.widthCollapse = this.widthTable.nativeElement.offsetWidth - this.paddingCollapse;
        this.widthTable.nativeElement.click()
      });
      setTimeout(() => {
        let that = this;

        if(that.billOrderLines){
          let wrapScroll = that.billOrderLines.nativeElement.closest('.tds-table-body');

          wrapScroll.addEventListener('scroll', function() {
            let scrollleft = wrapScroll.scrollLeft;
            that.marginLeftCollapse = scrollleft;
          });
        }
      }, 500);
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
        map((event: any) => { return event.target.value }),
        debounceTime(750),
        // distinctUntilChanged(),
        // TODO: switchMap xử lý trường hợp sub in sub
        switchMap((text: TDSSafeAny) => {

          this.tabIndex = 1;
          this.pageIndex = 1;
          this.indClickTag = -1;

          this.filterObj.searchText = text;
          let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
          let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
          return this.getViewData(params);
      })
    ).subscribe((res: any) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = res.value;
    }, error => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
    });
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
        endDate: event.dateRange.endDate
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
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.innerText.nativeElement.value = '';
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
        this.fastSaleOrderService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.message.success('Xóa hóa đơn thành công!');
            this.loadSummaryStatus();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
