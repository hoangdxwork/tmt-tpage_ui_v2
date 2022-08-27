import { ConversationPostEvent } from './../../../../handler-v2/conversation-post/conversation-post.event';
import { ConversationOrderDTO } from './../../../../dto/coversation-order/conversation-order.dto';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { SaleOnlineOrderSummaryStatusDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSCheckboxChange } from 'tds-ui/tds-checkbox';
import { ODataSaleOnline_OrderModel } from '@app/dto/saleonlineorder/odata-saleonline-order.dto';
import { EditOrderV2Component } from '@app/pages/order/components/edit-order/edit-order-v2.component';

@Component({
  selector: 'conversation-order-list',
  templateUrl: './conversation-order-list.component.html',
  providers: [TDSDestroyService]
})
export class ConversationOrderListComponent implements OnInit {

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

  currentPost!: ChatomniObjectsItemDto;
  isLoading: boolean = false;
  isLoadingLine: boolean = false;
  lstOfData: Array<ConversationOrderDTO> = [];
  tabNavs: Array<TDSSafeAny> = [];

  lstLine: any[] = [];

  count: number = 0;

  constructor(private conversationPostFacade: ConversationPostFacade,
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService,
    private orderPrintService: OrderPrintService,
    private conversationPostEvent: ConversationPostEvent,
    private modalService: TDSModalService,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef,
    private excelExportService: ExcelExportService) {
  }

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.conversationPostFacade.onPostChanged$.pipe(takeUntil(this.destroy$))
      .pipe(map((item: ChatomniObjectsItemDto) => {

        this.currentPost = item;

        this.loadSummaryStatus();
        this.loadData(this.pageSize,this.pageIndex);

        return item;
      }))
      .subscribe();
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataSaleOnline_OrderService.buildFilterByPost(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
      next:(res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;

        this.lstOfData = [...res.value];
      },
      error:(error) => {
        this.message.error(error?.error?.message || Message.CanNotLoadData);
      }
    });

    this.loadSummaryStatus();
  }

  getViewData(params: string) {
    this.isLoading = true;

    return this.odataSaleOnline_OrderService
      .getViewByPost(this.currentPost.ObjectId, params, this.filterObj)
      .pipe(finalize(() => this.isLoading = false ));
  }

  getLine(id: string) {
    this.isLoadingLine = true;

    this.saleOnline_OrderService.getLines(id)
      .pipe(finalize(() => this.isLoadingLine = false))
      .subscribe({
        next:(res) => {
          this.lstLine = res ? [...res.value] : [];
        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
        }
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

        this.conversationPostEvent.getOrderTotal$.emit(total);

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

  onCheck(orderId: string, event: TDSCheckboxChange) {
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
    let datas = this.lstOfData.filter(x => ids.includes(x.Id));

    if(TDSHelperArray.hasListValue(datas)) {
      datas.forEach(x => {
          this.orderPrintService.printIpFromOrder(x);
      });

      this.isLoadingActive = false;
    }
  }

  exportExcel() {
    if (this.isLoadingActive) { return }
    let ids = [...this.setOfCheckedId];

    this.excelExportService.exportPost(`/SaleOnline_Order/ExportFile`,
      {
        data: JSON.stringify({}),
        campaignId: null,
        postId: this.currentPost.ObjectId,
        ids: ids,
      }, `don_hang_online`)
      .pipe(finalize(() => this.isLoadingActive = false), takeUntil(this.destroy$))
      .subscribe();
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
      .subscribe({
        next:(res) => {
          this.message.success(Message.DeleteSuccess);

          this.loadData(this.pageSize, this.pageIndex);
        },
        error:(error) => {
          this.message.error(error?.error?.message || JSON.stringify(error));
        }
      });
  }

  onEdit(item: any) {
    if(item && item.Id) {
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

                modal.afterClose?.subscribe((obs: string) => {
                    if (TDSHelperString.hasValueString(obs) && obs == 'onLoadPage') {
                        this.loadData(this.pageSize, this.pageIndex);
                    }
                })
              }
          },
          error: (error: any) => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          }
      });
    }
  }
}
