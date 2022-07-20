import { Component, Input, OnInit } from '@angular/core';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';

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

  filterObj: any = {
    searchText: ''
  };

  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  isLoading: boolean = false;

  lstOfData: any[] = [];

  constructor(
    private message: TDSMessageService,
    private oDataLiveCampaignService: ODataLiveCampaignService
  ) { }

  ngOnInit(): void {

  }

  loadData(pageSize: number, pageIndex: number) {
  }

  getViewData(params: string) {
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
