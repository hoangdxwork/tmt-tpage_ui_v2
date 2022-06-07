import { HistoryDeliveryStatusDetailDTO } from './../../../dto/fastsaleorder/fastsaleorder.dto';
import { TDSSafeAny } from 'tmt-tang-ui';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TDSMessageService } from 'tmt-tang-ui';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { HistoryDeliveryDTO } from './../../../dto/bill/bill.dto';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'history-delivery-status-detail',
  templateUrl: './history-delivery-status-detail.component.html'
})
export class HistoryDeliveryStatusDetailComponent implements OnInit {
  @Input() HDSData!:HistoryDeliveryDTO;

  lstOfData:HistoryDeliveryStatusDetailDTO[] = [];
  isLoading = false;
  

  private destroy$ = new Subject();

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.initHDSData();
  }

  initHDSData(){
    this.isLoading = true;
    this.fastSaleOrderService.getHistoryDeliveryStatusById(this.HDSData.Id).pipe(takeUntil(this.destroy$),finalize(()=>this.isLoading = false)).subscribe(
      (res:TDSSafeAny)=>{
        delete res["@odata.context"];
        this.lstOfData = res.Details;
      },
      (err)=>{
        this.message.error(err.error.message || 'Tải dữ liệu thất bại');
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
