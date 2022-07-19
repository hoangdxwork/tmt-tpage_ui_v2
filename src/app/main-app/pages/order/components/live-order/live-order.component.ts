import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { OdataGetOrderPartnerIdDTO, OdataGetOrderPartnerIdModal } from 'src/app/main-app/dto/saleonlineorder/odata-getorderpartnerid.dto';
import { QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { OdataGetOrderPartnerIdService } from 'src/app/main-app/services/mock-odata/odata-getorder-partnerid.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'app-live-order',
  templateUrl: './live-order.component.html',
})
export class LiveOrderComponent implements OnInit {

  @Input() partnerId!: number;

  public filterObj: TDSSafeAny = {
    searchText: '',
  }
  pageSize: number = 1;
  lstOrder!: Array<OdataGetOrderPartnerIdModal>;
  destroy$ = new Subject<void>();

  constructor(
    private getOrderPartnerIdService : OdataGetOrderPartnerIdService,
  ) { }

  ngOnInit(): void {

  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadOrder(params.pageSize, params.pageIndex);
  }

  loadOrder(pageSize: number, pageIndex: number) {
    if(this.partnerId) {
      let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
      this.getOrderPartnerIdService.getOrdersByPartner(this.partnerId, params).pipe(takeUntil(this.destroy$)).subscribe(res => {
        console.log("HUi: ",res);
        this.lstOrder = res.value;
      })
    }
  }

}
