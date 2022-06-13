import { Component, Input, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataLiveCampaignBillService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-bill.service';
import { FastSaleOrderDTO, FastSaleOrderModelDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { SortEnum } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { finalize } from 'rxjs/operators';
import { FilterLiveCampaignBillDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { TagService } from 'src/app/main-app/services/tag.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Router } from '@angular/router';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'detail-bill',
  templateUrl: './detail-bill.component.html'
})
export class DetailBillComponent implements OnInit {

  @Input() liveCampaignId!: string;

  public filterObj: FilterLiveCampaignBillDTO = {
    tags: [],
    status: '',
    bill: null,
    liveCampaignId: '',
    deliveryType: '',
    isWaitPayment: false,
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

  lstOfData: Array<FastSaleOrderModelDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  indClickTag = -1;

  public lstTags: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  constructor(
    private message: TDSMessageService,
    private tagService: TagService,
    private router: Router,
    private fastSaleOrderService: FastSaleOrderService,
    private oDataLiveCampaignBillService: ODataLiveCampaignBillService
  ) { }

  ngOnInit() {
    this.setFilter();
    this.loadTags();
  }

  setFilter() {
    this.filterObj.liveCampaignId = this.liveCampaignId;
    this.filterObj.isWaitPayment = true;
  }

  loadTags(){
    let type = "fastsaleorder";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    })
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignBillService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe(res => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;
    }, error => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
    });
  }

  private getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignBillService
        .getView(params, this.filterObj)
        .pipe(finalize(() => {this.isLoading = false }));
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: event.tags,
      status: event.status,
      bill: event.bill,
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: event.deliveryType,
      searchText: event.searchText,
      dateRange: {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: [],
      status: '',
      bill: null,
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: '',
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

  onEdit(id: number) {
    this.router.navigateByUrl(`bill/detail/${id}`);
  }

  closeTag(): void {
    this.indClickTag = -1;
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
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

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "draft":
        return "secondary";
      case "paid":
        return "primary";
      case "open":
        return "info";
      case "cancel":
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
