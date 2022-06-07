import { Component, Input, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'detail-bill-payment',
  templateUrl: './detail-bill-payment.component.html'
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

  lstOfData: Array<TDSSafeAny> = [];
  lstOfCurrenData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  indClickTag = -1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  isVisible = false;
  isVisiblePayment = false;

  constructor() { }

  ngOnInit(): void {
    this.lstOfData = new Array(200).fill(0).map((_, index) => ({
      id: index,
      name: `Edward King`,
      age: 32,
      date: "19/03/2022",
      image: "assets/images/live-campaign/demo1.jpg",
    }));
  }

  loadData(pageSize: number, pageIndex: number) {

  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: event.tags,
      status: event.status,
      bill: event.bill,
      deliveryType: event.deliveryType,
      searchText: event.searchText,
      dateRange: {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  showModal() {
    this.isVisible = true;
  }

  showModalPayment() {
    this.isVisiblePayment = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  handleOkPayment(): void {
    console.log('Button ok clicked!');
    this.isVisiblePayment = false;
  }

  handleCancelPayment(): void {
    console.log('Button cancel clicked!');
    this.isVisiblePayment = false;
  }

}
