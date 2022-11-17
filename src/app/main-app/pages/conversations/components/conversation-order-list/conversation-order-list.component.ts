import { FastSaleOrderService } from './../../../../services/fast-sale-order.service';
import { GetListOrderIdsDTO } from './../../../../dto/saleonlineorder/list-order-ids.dto';
import { CreateBillFastComponent } from './../../../order/components/create-bill-fast/create-bill-fast.component';
import { ConversationPostEvent } from './../../../../handler-v2/conversation-post/conversation-post.event';
import { ConversationOrderDTO } from './../../../../dto/coversation-order/conversation-order.dto';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { SaleOnlineOrderSummaryStatusDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { EditOrderV2Component } from '@app/pages/order/components/edit-order/edit-order-v2.component';
import { ChatomniObjectFacade } from '@app/services/chatomni-facade/chatomni-object.facade';

@Component({
  selector: 'conversation-order-list',
  templateUrl: './conversation-order-list.component.html',
  providers: [TDSDestroyService]
})

export class ConversationOrderListComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;

  isOpenCollapCheck: boolean = false;
  indeterminate: boolean = false;
  checked: boolean = false;
  isCheckedAll: boolean = false;

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

  pageSize = 10;
  pageIndex = 1;
  tabIndex: number = 1;

  currentPost!: ChatomniObjectsItemDto;
  isLoading: boolean = false;
  isLoadingLine: boolean[] = [];
  lstOfData: Array<ConversationOrderDTO> = [];
  tabNavs: Array<TDSSafeAny> = [];
  lstLine: any[] = [];
  count: number = 0;
  disableCheck: boolean = false;

  constructor(private chatomniObjectFacade: ChatomniObjectFacade,
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService,
    private orderPrintService: OrderPrintService,
    private conversationPostEvent: ConversationPostEvent,
    private modalService: TDSModalService,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef,
    private fastSaleOrderService: FastSaleOrderService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if(this.data && this.data.ObjectId) {
      this.currentPost = this.data;
      this.loadData(this.pageSize, this.pageIndex);
    }

    this.eventEmitter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'] && !changes['data'].firstChange) {
        this.currentPost = changes['data'].currentValue;
        this.loadData(this.pageSize, this.pageIndex);
    }
  }

  eventEmitter() {
    // TODO: load lại danh sách đơn hàng khi tạo đơn hàng từ comments
    this.chatomniObjectFacade.onLoadCommentOrderByPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if(this.currentPost && this.currentPost.ObjectId) {
            this.loadData(this.pageSize, this.pageIndex);
          }
        }, 350)
      }
    })
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataSaleOnline_OrderService.buildFilterByPost(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: TDSSafeAny) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...res.value];

          //gán tạm thời
          let data = [{ Name: "Tất cả", Index: 1, Total: this.count }];
          this.tabNavs = [...data];

          this.setOfCheckedId = new Set<string>();
          this.checked = false;
          this.indeterminate = false;

          this.cdr.detectChanges();
      },
      error:(error) => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
          this.cdr.detectChanges();
      }
    });
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.odataSaleOnline_OrderService
      .getViewByPost(this.currentPost.ObjectId, params, this.filterObj)
      .pipe(finalize(() => this.isLoading = false ));
  }

  getLine(id: string, index: number) {
    this.isLoadingLine[index] = true;
    this.saleOnline_OrderService.getLines(id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
          this.lstLine[index] = res ? [...res.value] : [];
          this.isLoadingLine[index] = false;
      },
      error:(err) => {
          this.isLoadingLine[index] = false;
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
      }
    });
  }

  refreshData() {
    this.pageIndex = 1;
    this.tabIndex = 1;
    this.filterObj = {
      tags: [],
      status: '',
      searchText: ''
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  changePageSize(pageSize:number){
    this.pageSize = pageSize;
    this.loadData(this.pageSize, this.pageIndex);
  }

  changePageIndex(pageIndex:number){
    this.pageIndex = pageIndex;
    this.loadData(this.pageSize, this.pageIndex);
  }

  applyFilter(event: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;

    this.filterObj.searchText = event.value;
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadSummaryStatus() {
    let model : SaleOnlineOrderSummaryStatusDTO = {
      SearchText: this.filterObj.searchText,
      TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
      PostId: this.currentPost.ObjectId
    }

    this.isLoading = true;
    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: Array<TDSSafeAny>) => {
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
          //TODO: load số lượng đơn hàng
          // this.conversationPostEvent.getOrderTotal$.emit(total);

          this.tabNavs.push({ Name: "Tất cả", Index: 1, Total: total });
          this.tabNavs.sort((a, b) => a.Index - b.Index);
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
      }
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

  onActiveChange(order: any, event: boolean, index: number) {
    event && this.getLine(order.Id, index);
  }

  onCheck(orderId: string, event: TDSSafeAny) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let exist = this.setOfCheckedId.has(orderId);
    if (!exist) {
      this.setOfCheckedId.add(orderId);
    } else {
      this.setOfCheckedId.delete(orderId);
    }
    this.refreshCheckedStatus();
  }

  onActive(value: string) {
    if(this.checkValueEmpty() === 1) {
      switch(value) {
        case 'print':
          this.printMulti();
          break;
        case 'fastSO':
          this.onCreateQuicklyFS();
          break;
        case 'delete':
          this.deleteMulti();
          break;
        default:
          this.message.info(Message.EmptyData);
          break;
      }
    }

    // TODO: trường hợp ko có data thì ẩn
    if(!TDSHelperArray.hasListValue(this.lstOfData)){
      this.disableCheck = true;
    }
  }

  setCheck(){
    this.isOpenCollapCheck = !this.isOpenCollapCheck;
    if(!this.isOpenCollapCheck) {
      this.setOfCheckedId = new Set<string>();
      this.checked = false;
      this.indeterminate = false;
    }
  }

  onAllChecked(value: TDSSafeAny): void {
    this.lstOfData.forEach(x => this.updateCheckedSet(x.Id, value.checked));

    this.refreshCheckedStatus();
    this.isCheckedAll = !this.isCheckedAll;
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
        this.setOfCheckedId.add(id);
    } else {
        this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: TDSSafeAny): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
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
    if(this.isLoading){
      return
    }

    this.isLoading = true;
    let ids = [...this.setOfCheckedId];
    let datas = this.lstOfData.filter(x => ids.includes(x.Id));

    if(TDSHelperArray.hasListValue(datas)) {
      datas.forEach(x => {
          this.orderPrintService.printIpFromOrder(x);
      });

      this.isLoading = false;
    }
  }

  onCreateQuicklyFS() {
    if (this.checkValueEmpty() == 1) {
      this.isLoading = true;
      let ids: any[] = [];
      ids = [...this.setOfCheckedId];

      this.showModalCreateBillFast(ids)
    }
  }

  showModalCreateBillFast(ids: string[]) {
    this.fastSaleOrderService.getListOrderIds({ids: ids}).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if (res) {
            this.modalService.create({
                title: 'Tạo hóa đơn nhanh',
                content: CreateBillFastComponent,
                centered: true,
                size: 'xl',
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                  lstData: [...res.value] as GetListOrderIdsDTO[]
                }
            });

            this.modalService.afterAllClose.subscribe({
              next:(x: any) =>{
                  this.loadData(this.pageSize,this.pageIndex);
              }
            });
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      });
  }

  deleteMulti() {
    if(this.isLoading){
      return
    }

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
    this.isLoading = true;
    // let exist
    this.odataSaleOnline_OrderService.removeIds({ids: ids}).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
            this.isLoading = false;
            this.message.success(Message.DeleteSuccess);

            // TODO: đẩy sự kiện qua conversation-order-list, comment-filter-all
            this.chatomniObjectFacade.onLoadCommentOrderByPost$.emit(true);

            this.setOfCheckedId = new Set<string>();
            this.checked = false;
            this.indeterminate = false;
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(error?.error?.message || JSON.stringify(error));
        }
      });
  }

  onEdit(item: any, event: TDSSafeAny) {
    if(item && item.Id) {
      this.isLoading = true;

      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              if(res && res.Id) {
                delete res['@odata.context'];

                const modal = this.modalService.create({
                    title: res.Code ? `Sửa đơn hàng <span class="text-primary-1 font-semibold text-title-1 pl-2">${res.Code}</span>` : `Sửa đơn hàng`,
                    content: EditOrderV2Component,
                    size: 'xl',
                    viewContainerRef: this.viewContainerRef,
                    bodyStyle:{
                      'padding': '0'
                    },
                    componentParams: {
                      dataItem: { ...res }
                    }
                })

                modal.afterClose?.subscribe({
                  next: (obs: any) => {
                      // TODO: đẩy sự kiện qua conversation-order-list, comment-filter-all
                      this.chatomniObjectFacade.onLoadCommentOrderByPost$.emit(true);
                  },
                })
              }
              this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          }
      });
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onClearFilter(){
    this.tabIndex = 1;
    this.pageIndex = 1;

    this.filterObj.searchText = '';
    // đóng tạm thời
    // this.loadSummaryStatus();
    this.loadData(this.pageSize, this.pageIndex);
  }
}
