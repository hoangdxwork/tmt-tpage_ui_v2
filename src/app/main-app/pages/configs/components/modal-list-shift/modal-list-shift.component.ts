import { ModalUpdateShiftComponent } from './../modal-update-shift/modal-update-shift.component';
import { ModalAddShiftComponent } from './../modal-add-shift/modal-add-shift.component';
import { TDSModalService, TDSModalRef, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-list-shift',
  templateUrl: './modal-list-shift.component.html',
  styleUrls: ['./modal-list-shift.component.scss']
})
export class ModalListShiftComponent implements OnInit {

  listOfDataShift = [
    { id: 1, name: 'Ca sáng', timeStart: '8h00', timeEnd: '12h00' },
    { id: 2, name: 'Ca chiều', timeStart: '13h00', timeEnd: '17h30' },
    { id: 3, name: 'Tăng ca', timeStart: '17h30', timeEnd: '20h00' },
    { id: 4, name: 'Test', timeStart: '15h30', timeEnd: '17h00' },


  ]
  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }
  showModalAddShift() {
    const modal = this.modalService.create({
      title: 'Thêm ca làm việc mới',
      content: ModalAddShiftComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  showModalUpdateShift(data: any) {
    const modal = this.modalService.create({
      title: 'Cập nhập ca làm việc',
      content: ModalUpdateShiftComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        shiftId: data.id
      }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  cancel() {
    this.modal.destroy(null);
  }
  showModalRemove(i: number) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa ca làm việc',
      content: 'Bạn có chắc muốn xóa ca làm việc này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        //remove item here

      },
      onCancel: () => {
        modal.close();
      },
    })
  }

}
