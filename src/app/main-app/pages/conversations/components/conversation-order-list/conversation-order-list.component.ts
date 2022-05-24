import { TDSMessageService, TDSHelperArray, TDSModalService, TDSCheckbox, TACheckboxChange } from 'tmt-tang-ui';
import { finalize, takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { TDSSafeAny } from 'tmt-tang-ui';
import { addDays } from 'date-fns';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { SaleOnlineOrderSummaryStatusDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';

@Component({
  selector: 'conversation-order-list',
  templateUrl: './conversation-order-list.component.html'
})
export class ConversationOrderListComponent implements OnInit,OnDestroy {

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    searchText: '',
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstActive = [
    {text: 'In nhiều', value: 'print'},
    {text: 'Excel', value: 'excel'},
    {text: 'Xóa nhiều', value: 'delete'}
  ];

  isLoadingActive: boolean = false;
  setOfCheckedId = new Set<string>();

  pageSize = 20;
  pageIndex = 1;
  tabIndex: number = 1;

  currentPost!: FacebookPostItem;
  isLoading: boolean = false;
  isLoadingLine: boolean = false;
  lstOfData: Array<TDSSafeAny> = [];
  tabNavs: Array<TDSSafeAny> = [];

  lstLine: any[] = [];

  count: number = 0;
  private destroy$ = new Subject();

  constructor(
    private conversationPostFacade: ConversationPostFacade,
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService,
    private conversationOrderFacade: ConversationOrderFacade,
    private orderPrintService: OrderPrintService,
    private modalService: TDSModalService,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.conversationPostFacade.onPostChanged$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentPost = res;
      this.loadData(this.pageSize, this.pageIndex);
    });
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataSaleOnline_OrderService.buildFilterByPost(this.filterObj);
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
      .getViewByPost(this.currentPost.fbid, params, this.filterObj)
      .pipe(finalize(() => this.isLoading = false ));
  }

  getLine(id: string) {
    this.isLoadingLine = true;
    this.saleOnline_OrderService.getLines(id)
      .pipe(finalize(() => this.isLoadingLine = false))
      .subscribe(res => {
        this.lstLine = res?.value;
      });
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj = {
      tags: [],
      status: '',
      searchText: ''
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  applyFilter(event: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;

    this.filterObj.searchText = event.target.value;
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadSummaryStatus() {
    let model : SaleOnlineOrderSummaryStatusDTO = {
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

  onSelectChange(Index: TDSSafeAny) {
    const dataItem =  this.tabNavs.find(f =>{ return f.Index == Index })
    this.pageIndex = 1;

    this.filterObj = {
      tags: [],
      status: dataItem?.Name != 'Tất cả' ? dataItem?.Name : null,
      searchText: '',
    };

    this.loadData(this.pageSize, this.pageIndex);
  }

  onActiveChange(order: any, event: boolean) {
    event && this.getLine(order.Id);
  }

  onEdit(order: TDSSafeAny) {
    this.conversationOrderFacade.onEditOrderFromPostComment.emit(order);
  }

  onCheck(orderId: string, event: TACheckboxChange) {
    if (event?.checked) {
      this.setOfCheckedId.add(orderId);
    } else {
      this.setOfCheckedId.delete(orderId);
    }
  }

  onActive(value: string) {
    if(this.checkValueEmpty() === 1) {
      switch(value) {
        case 'print':
          this.printMulti();
          break;
        case 'excel':
          this.exportExcel();
          break;
        case 'delete':
          this.deleteMulti();
          break;
        default:
          this.message.info(Message.EmptyData);
          break;
      }
    }
  }

  checkValueEmpty() {
    let ids = [...this.setOfCheckedId];

    if (ids.length == 0) {
      this.message.error(Message.SelectOneLine);
      return 0;
    }

    return 1;
  }

  printMulti() {
    this.isLoadingActive = true;
    let ids = [...this.setOfCheckedId];
    let data = this.lstOfData.filter(x => ids.includes(x.Id));

    if(TDSHelperArray.hasListValue(data)) {
      data.forEach(order => {
        this.orderPrintService.printOrder(order, null);
      });
      this.isLoadingActive = false;
    }
  }

  exportExcel() {
    this.isLoadingActive = true;
    let ids = [...this.setOfCheckedId];

    this.excelExportService.exportPost(`/SaleOnline_Order/ExportFile`,
      {
        data: JSON.stringify({}),
        campaignId: null,
        postId: this.currentPost.fbid,
        ids: ids,
      },
      `don_hang_online`);

    this.isLoadingActive = false;
  }

  deleteMulti() {
    let ids = [...this.setOfCheckedId];

    const modal = this.modalService.error({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa danh sách đơn hàng không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.deleteIds(ids);
      },
      onCancel: () => {
        modal.close();
      },
    })
  }

  deleteIds(ids: string[]) {
    this.isLoadingActive = true;

    this.odataSaleOnline_OrderService.removeIds({ids: ids})
      .pipe(finalize(() => this.isLoadingActive = false))
      .subscribe(res => {
        this.message.success(Message.DeleteSuccess);
        this.loadData(this.pageSize, this.pageIndex);
      }, error => {this.message.error(`${error?.error?.message}` || JSON.stringify(error))});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
