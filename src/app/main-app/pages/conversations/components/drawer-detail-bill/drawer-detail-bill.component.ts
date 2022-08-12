import { ViewConversation_FastSaleOrdersDTO } from './../../../../dto/fastsaleorder/view_fastsaleorder.dto';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'drawer-detail-bill',
  templateUrl: './drawer-detail-bill.component.html'
})
export class DrawerDetailBillComponent implements OnInit {
  @Input() bill!: ViewConversation_FastSaleOrdersDTO;

  visibleDrawerBillDetail: boolean = false; 

  constructor() { }

  ngOnInit(): void {
  }

  onDrawerDetailBill(){
    this.visibleDrawerBillDetail = true;
  }

  onClose(){
    this.visibleDrawerBillDetail = false;
  }
}
