import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Subject, takeUntil } from 'rxjs';
import { OdataSaleCouponProgramService } from 'src/app/main-app/services/mock-odata/odata-sale-coupon-program.service';
import { SaleCouponProgramDTO } from './../../../../dto/configs/sale-coupon-program.dto';
import { SaleCouponProgramService } from './../../../../services/sale-coupon-program.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-apply-promotion',
  templateUrl: './modal-apply-promotion.component.html'
})
export class ModalApplyPromotionComponent implements OnInit {
  lstCheck:{value:string,isSelected:boolean}[] = [];
  lstOfSaleCouponProgram: SaleCouponProgramDTO[] = [];
  isLoading:boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private saleCouponProgramService: OdataSaleCouponProgramService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.lstCheck = [
      {
        value: 'Giảm 0% trên tổng tiền',
        isSelected: false
      },
      {
        value: 'Giảm 10% trên tổng tiền',
        isSelected: true
      },
      {
        value: 'Giảm 20% trên tổng tiền',
        isSelected: false
      },
      {
        value: 'Giảm 30% trên tổng tiền',
        isSelected: true
      },
      {
        value: 'Giảm 40% trên tổng tiền',
        isSelected: true
      },
    ]
  }

  onSave() {
    this.modalRef.destroy(null);
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
