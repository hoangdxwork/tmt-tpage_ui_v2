
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { addDays } from 'date-fns';
import { ODataLiveCampaignOrderService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-order.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize } from 'rxjs/operators';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSModalService } from 'tds-ui/modal';

@Component({
  selector: 'detail-order',
  templateUrl: './detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  public filterObj: any = {
    tags: [],
    status: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private oDataLiveCampaignOrderService: ODataLiveCampaignOrderService
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;

    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignOrderService
        .getView(params, this.filterObj, this.liveCampaignId)
        .pipe(finalize(() => this.isLoading = false ));
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

  refreshData(){
    this.pageIndex = 1;

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

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(id: string) {
    // const modal = this.modal.create({
    //   title: 'Sửa đơn hàng',
    //   content: ModalEditOrderComponent,
    //   size: 'xl',
    //   viewContainerRef: this.viewContainerRef,
    //   componentParams: {
    //     idOrder: id
    //   }
    // });

    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // modal.afterClose.subscribe((result: TDSSafeAny) => {
    //   console.log('[afterClose] The result is:', result);
    //   if (TDSHelperObject.hasValue(result)) {
    //     this.loadData(this.pageSize, this.pageIndex);
    //   }
    // });
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
        this.loadData(this.pageSize, this.pageIndex);
      }, error => this.message.error(`${error?.error?.message}` || Message.ErrorOccurred));
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

  onSearch(event: TDSSafeAny) {
    let text =  event?.target.value;

    this.pageIndex = 1;
    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

}
