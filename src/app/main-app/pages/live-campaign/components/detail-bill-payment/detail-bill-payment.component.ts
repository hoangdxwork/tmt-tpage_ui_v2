import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SortEnum } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderDTO, FastSaleOrderModelDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { TagsPartnerDTO } from 'src/app/main-app/dto/partner/partner-tags.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ODataLiveCampaignBillService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-bill.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { TDSMessageService, TDSSafeAny, TDSTableQueryParams, TDSTagStatusType } from 'tmt-tang-ui';

@Component({
  selector: 'detail-bill-payment',
  templateUrl: './detail-bill-payment.component.html',
  styles: [
    `tr:hover .show-payment {
      display: block
    }`
  ]
})
export class DetailBillPaymentComponent implements OnInit {

  @Input() liveCampaignId!: string;

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

  public lstTags: TagsPartnerDTO[] = [];
  public modelTags: Array<TDSSafeAny> = [];

  constructor(
    private tagService: TagService,
    private message: TDSMessageService,
    private router: Router,
    private fastSaleOrderService: FastSaleOrderService,
    private oDataLiveCampaignBillService: ODataLiveCampaignBillService
  ) { }

  ngOnInit(): void {
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
    });
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
      isWaitPayment: true,
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
      isWaitPayment: true,
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

  onSearch(event: TDSSafeAny) {
    let text =  event?.target.value;

    this.pageIndex = 1;
    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onEdit(id: number) {
    this.router.navigateByUrl(`bill/detail/${id}`);
  }

  onPayment(id: number) {
    this.message.info("Thanh toán");
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

}
