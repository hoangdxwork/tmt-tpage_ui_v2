import { Component, Input, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'detail-order',
  templateUrl: './detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {

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

}
