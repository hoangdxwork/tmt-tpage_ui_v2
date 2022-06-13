import { ModalDetailBillComponent } from './../modal-detail-bill/modal-detail-bill.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSHelperObject } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-list-bill',
  templateUrl: './modal-list-bill.component.html'
})
export class ModalListBillComponent implements OnInit {

  listOfData = ['']
  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null)
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Đã xác nhận":
        return "success";
      case "Nháp":
        return "secondary";
      default :
        return "error";
    }
  }

  showModalDetailBill(id: string){
    const modal = this.modalService.create({
      title: `Hóa đơn [${id}]`,
      content: ModalDetailBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }
}
