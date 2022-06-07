import { TDSMessageService, TDSTableQueryParams } from 'tmt-tang-ui';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { FilterLiveCampaignProductDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize } from 'rxjs/operators';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { ReportLiveCampaignProductDataDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';

@Component({
  selector: 'detail-product',
  templateUrl: './detail-product.component.html'
})
export class DetailProductComponent implements OnInit {

  isVisible = false;
  @Input() liveCampaignId!: string;

  expandSet = new Set<number | undefined>();

  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
    {
      id: 4,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
    {
      id: 5,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
    {
      id: 6,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
  ];

  filterObj: FilterLiveCampaignProductDTO = {
    searchText: ''
  };

  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  isLoading: boolean = false;

  lstOfData: ReportLiveCampaignProductDataDTO[] = [];

  constructor(
    private message: TDSMessageService,
    private oDataLiveCampaignService: ODataLiveCampaignService
  ) { }

  ngOnInit(): void {

  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignService.buildFilterProduct(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;

    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignService
        .getProduct(this.liveCampaignId, params)
        .pipe(finalize(() => this.isLoading = false ));
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

}
