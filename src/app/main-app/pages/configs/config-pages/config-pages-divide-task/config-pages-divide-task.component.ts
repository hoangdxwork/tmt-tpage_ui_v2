import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-pages-divide-task',
  templateUrl: './config-pages-divide-task.component.html',
  styleUrls: ['./config-pages-divide-task.component.scss']
})
export class ConfigPagesDivideTaskComponent implements OnInit {

  isOpenTagContainsPhone: boolean = true;
  isOpenTagAfterConfirmingAndPrintingOrder: boolean = true;
  isOpenTagAfterCreatingOrder: boolean = true;
  isOpenTagDraftOrder: boolean = true;
  isOpenTagContainsKeyword: boolean = true;
  isOpenTagAfterConfirmingAndPrintingOrdeShip: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeTagContainsPhone(){
    this.isOpenTagContainsPhone = !this.isOpenTagContainsPhone
  }
  onChangeTagAfterConfirmingAndPrintingOrder(){
    this.isOpenTagAfterConfirmingAndPrintingOrder = !this.isOpenTagAfterConfirmingAndPrintingOrder
  }
  onChangeTagAfterCreatingOrder(){
    this.isOpenTagAfterCreatingOrder = !this.isOpenTagAfterCreatingOrder
  }
  onChangeTagDraftOrder(){
    this.isOpenTagDraftOrder = !this.isOpenTagDraftOrder
  }
  onChangeTagContainsKeyword(){
    this.isOpenTagContainsKeyword = !this.isOpenTagContainsKeyword
  }
  onChangeTagAfterConfirmingAndPrintingOrdeShip(){
    this.isOpenTagAfterConfirmingAndPrintingOrdeShip = !this.isOpenTagAfterConfirmingAndPrintingOrdeShip
  }
}
