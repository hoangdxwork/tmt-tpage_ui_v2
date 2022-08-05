import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { Subject, takeUntil, finalize, Observable } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, Input, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';

@Component({
  selector: 'detail-product',
  templateUrl: './detail-product.component.html'
})
export class DetailProductComponent implements OnInit {

  isVisible = false;
  @Input() liveCampaignId!: string;

  expandSet = new Set<number | undefined>();

  filterObj: any = {
    searchText: ''
  };

  private destroy$ = new Subject<void>();
  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  isLoading: boolean = false;

  lstOfData: any[] = [];

  constructor(
    private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService,
    private oDataLiveCampaignService: ODataLiveCampaignService
  ) { }

  ngOnInit(): void {

  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.oDataLiveCampaignService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);
    this.getViewData(params).subscribe(res=>{
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
    }, error => {
      this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
    })
  }

  getViewData(params: string): Observable<TDSSafeAny> {
    this.isLoading = true;
    return this.liveCampaignService.getProduct(this.liveCampaignId, params)
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
