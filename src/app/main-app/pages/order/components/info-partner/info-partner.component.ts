import { TDSSafeAny, TDSModalRef, TDSTableQueryParams } from 'tmt-tang-ui';
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

  data: TDSSafeAny;
  revenue: TDSSafeAny;

  lstOfDataOrder: TDSSafeAny[] = [];
  pageSize = 20;
  pageIndex = 1;
  count: number = 0;

  formDate = new FormControl(null);

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

    this.refreshData();
  }

  loadPartner() {
    this.partnerService.getById(this.partnerId).subscribe((res: any) => {
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
    let filters = this.odataSaleOnline_OrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.odataSaleOnline_OrderService.getView(params, this.filterObj).subscribe((res: TDSSafeAny) => {

        console.log("view:", res);
        this.count = res['@odata.count'] as number;
        this.lstOfDataOrder = res.value;
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

  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
