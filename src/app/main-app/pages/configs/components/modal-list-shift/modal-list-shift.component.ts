import { finalize } from 'rxjs/operators';
import { ModalUpdateShiftComponent } from './../modal-update-shift/modal-update-shift.component';
import { ModalAddShiftComponent } from './../modal-add-shift/modal-add-shift.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserShiftDTO, ShiftDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-modal-list-shift',
  templateUrl: './modal-list-shift.component.html'
})
export class ModalListShiftComponent implements OnInit {

  lstShifts: ShiftDTO[] = [];
  isLoading: boolean = false;

  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts() {
    this.applicationUserService.getShifts().subscribe(res => {
      this.lstShifts = res.value;
    });
  }

  showModalAddShift() {
    const modal = this.modalService.create({
      title: 'Thêm ca làm việc',
      content: ModalAddShiftComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe(result => {
      if (result === true) {
        this.loadShifts();
      }
    });
  }

  showModalUpdateShift(data: any) {
    const modal = this.modalService.create({
      title: 'Cập nhật ca làm việc',
      content: ModalUpdateShiftComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        shiftId: data.Id
      }
    });

    modal.afterClose.subscribe(result => {
      if (result === true) {
        this.loadShifts();
      }
    });
  }

  cancel() {
    this.modal.destroy(null);
  }

  showModalRemove(data: ShiftDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa ca làm việc',
      content: 'Bạn có chắc muốn xóa ca làm việc này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.remove(data.Id);
      },
      onCancel: () => {
        modal.close();
      },
    })
  }

  remove(id: string) {
    this.isLoading = true;
    this.applicationUserService.removeShifts(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.DeleteSuccess);
        this.loadShifts();
      }, error => this.message.error(Message.ErrorOccurred));
  }

}
