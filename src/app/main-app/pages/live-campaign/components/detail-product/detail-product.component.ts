import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { takeUntil, finalize, Observable } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, Input, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { LiveCampaignReportProductDto, ODataLiveCampaignReportProductDto } from '@app/dto/live-campaign/livecampaign-report-product.dto';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'detail-product',
  templateUrl: './detail-product.component.html',
  providers: [TDSDestroyService]
})

export class DetailProductComponent implements OnInit {

  @Input() liveCampaignId!: string;

  isVisible = false;
  expandSet = new Set<number | undefined>();

  filterObj: any = {
    searchText: '',
    isOnlyProductCancel: false
  };

  filterData: any = [
    { text: 'Tất cả', value: false },
    { text: 'Sản phẩm hủy', value: true }
  ]

  pageIndex = 1;
  pageSize = 10;
  count: number = 0;
  isLoading: boolean = false;

  lstOfData: LiveCampaignReportProductDto[] = [];
  innerText!: string;

  constructor(private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private oDataLiveCampaignService: ODataLiveCampaignService) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.oDataLiveCampaignService.buildFilterReportProduct(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.getViewData(params).subscribe({
        next: (res: ODataLiveCampaignReportProductDto) => {
            this.lstOfData = [...(res?.Datas || [])];
            this.count = res?.TotalCount || 0;
        },
        error: (err: any) => {
            this.message.error(err.error.message);
        }
    })
  }

  getViewData(params: string): Observable<TDSSafeAny> {
    this.isLoading = true;
    return this.liveCampaignService.reportLiveCampaignProduct(this.liveCampaignId, params, this.filterObj.isOnlyProductCancel)
      .pipe(takeUntil(this.destroy$), finalize(()=>{ this.isLoading = false }))
  }

  onExpandChange(id: number | undefined, checked: boolean): void {
    if (checked) {
        this.expandSet.add(id);
    } else {
        this.expandSet.delete(id);
    }
  }

  refreshData() {
    this.filterObj = {
        searchText: '',
        isOnlyProductCancel: false
    }
    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSearch(event: TDSSafeAny) {
    let text = this.innerText;

    this.pageIndex = 1;
    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onFilterData(event: boolean) {
    this.filterObj.isOnlyProductCancel = event;
    this.loadData(this.pageSize, this.pageIndex);
  }
}
