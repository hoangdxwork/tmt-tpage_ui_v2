import { Component, OnInit } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';

@Component({
  selector: 'modal-get-notification',
  templateUrl: './modal-get-notification.component.html',
})
export class ModalGetNotificationComponent implements OnInit {

  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.modal.destroy(null);
  }

  openCancel() {
    this.modalService.error({
      title: 'Hủy đăng kí',
      content: 'Bạn có chắc muốn hủy đăng ký với thiết bị này!',
      onOk: () => console.log(' OK'),
      onCancel:()=>{console.log('cancel')},
      okText:"Xác nhận",
      cancelText:"Hủy bỏ"
  });
  }

}
