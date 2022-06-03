import { finalize } from 'rxjs/operators';
import { TDSSafeAny, TDSModalRef, TDSTableQueryParams, TDSHelperString } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FormControl } from '@angular/forms';
import { addDays } from 'date-fns';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';

@Component({
  selector: 'info-partner',
  templateUrl: './info-partner.component.html'
})
export class InfoPartnerComponent implements OnInit {

  @Input() dataOrder: TDSSafeAny;
  @Input() partnerId: TDSSafeAny;

  data: TDSSafeAny = {};
  revenue: TDSSafeAny;

  lstOfDataOrder: TDSSafeAny[] = [];
  pageSize = 20;
  pageIndex = 1;
  count: number = 0;

  lstDebitDetails: TDSSafeAny[] = [];
  lstDebitDetailsSearch!: TDSSafeAny;
  countDebitDetails: number = 0;

  formDate = new FormControl(null);
  rangeDate: TDSSafeAny;

  selectedIndex!: number;
  textSearch: string = '';

  public filterObj: TDSSafeAny = {
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

  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private partnerService: PartnerService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService
  ) { }

  ngOnInit(): void {
    this.loadPartner();
    this.loadPartnerRevenueById();
  }

  onSelectedTab(event: TDSSafeAny) {
    this.selectedIndex = event;
  }

  loadPartner() {
    this.isLoading = true;
    this.partnerService.getById(this.partnerId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        this.data = res;
      });
  }

  loadPartnerRevenueById() {
    this.partnerService.getPartnerRevenueById(this.partnerId).subscribe((res :any) => {
      this.revenue = res;
    });
  }

  loadOrder(pageSize: number, pageIndex: number) {
    this.isLoading = true;

    let filters = this.odataSaleOnline_OrderService.buildFilterByPartner(this.filterObj, this.partnerId);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.odataSaleOnline_OrderService.getView(params, this.filterObj).subscribe((res: TDSSafeAny) => {

        console.log("view:", res);
        this.count = res['@odata.count'] as number;
        this.lstOfDataOrder = res.value;
        this.isLoading = false;
    }, (error: TDSSafeAny) => {
      this.isLoading = false;
    });
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

    this.loadOrder(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadOrder(params.pageSize, params.pageIndex);
  }

  onSearch(event: TDSSafeAny) {
    let textSearch = event.target.value;

    let startDate = (this.rangeDate && this.rangeDate[0]) ? new Date(this.rangeDate[0]) : addDays(new Date(), -30);
    let endDate = (this.rangeDate && this.rangeDate[1]) ? new Date(this.rangeDate[1]) : new Date();

    if(this.selectedIndex == 1) {
      this.filterObj.searchText = textSearch;
      this.filterObj.dateRange = {
        startDate: startDate,
        endDate: endDate,
      }

      this.loadOrder(this.pageSize, this.pageIndex);
    }
    else if(this.selectedIndex == 2) {
      if(!TDSHelperString.hasValueString(textSearch) && (!this.rangeDate || this.rangeDate.length < 2)) {
        delete this.lstDebitDetailsSearch;
        return;
      }

      let textLowerCase = textSearch.toLowerCase();

      this.lstDebitDetailsSearch = this.lstDebitDetails.filter(x => x.DisplayedName.toLowerCase().indexOf(textLowerCase) !== -1 &&
      (new Date(x.Date)).getTime() >= startDate.getTime() && (new Date(x.Date)).getTime() <= endDate.getTime())
    }
  }

  onChangeRangePicker(event: TDSSafeAny) {
    let startDate = (this.rangeDate && this.rangeDate[0]) ? new Date(this.rangeDate[0]) : addDays(new Date(), -30);
    let endDate = (this.rangeDate && this.rangeDate[1]) ? new Date(this.rangeDate[1]) : new Date();

    if(this.selectedIndex == 1) {
      this.filterObj.searchText = this.textSearch;
      this.filterObj.dateRange = {
        startDate: startDate,
        endDate: endDate,
      };

      this.loadOrder(this.pageSize, this.pageIndex);
    }
    else if(this.selectedIndex == 2) {
      if(!TDSHelperString.hasValueString(this.textSearch) && (!this.rangeDate || this.rangeDate.length < 2)) {
        delete this.lstDebitDetailsSearch;
        return;
      }

      let textLowerCase = this.textSearch.toLowerCase();

      this.lstDebitDetailsSearch = this.lstDebitDetails.filter(x => x.DisplayedName.toLowerCase().indexOf(textLowerCase) !== -1 &&
      (new Date(x.Date)).getTime() >= startDate.getTime() && (new Date(x.Date)).getTime() <= endDate.getTime())
    }
  }

  loadCreditDebitCustomerDetail(pageSize: number, pageIndex: number) {
    // TODO: mặc định lấy 20 đơn đầu, do tính năng ít dùng, dữ liệu ít
    this.isLoading = true;
    this.partnerService.getCreditDebitCustomerDetail(this.partnerId, pageIndex, pageSize).subscribe((res: any) => {
        this.lstDebitDetails = res.value;
        this.countDebitDetails = res.count;
        this.isLoading = false;
    }, (error: TDSSafeAny) => {
      this.isLoading = false;
    });
  }

  refreshCreditDebit() {
    this.loadCreditDebitCustomerDetail(0, 20);
  }

  onQueryParamsChangeCreditDebit(params: TDSTableQueryParams) {
    this.loadCreditDebitCustomerDetail(params.pageSize, params.pageIndex);
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
