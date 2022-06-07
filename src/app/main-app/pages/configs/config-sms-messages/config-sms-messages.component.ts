import { ConfigDataFacade } from './../../../services/facades/config-data.facade';
import { takeUntil } from 'rxjs/operators';
import { RestSMSDTO } from './../../../dto/sms/sms.dto';
import { RestSMSService } from './../../../services/sms.service';
import { SMSMessagesAddServiceModalComponent } from '../components/sms-messages-add-service-modal/sms-messages-add-service-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-config-sms-messages',
  templateUrl: './config-sms-messages.component.html'
})
export class ConfigSmsMessagesComponent implements OnInit {
  listOfDataRestSMS: Array<RestSMSDTO> = [];

  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private restSMSService: RestSMSService,
    private configDataService: ConfigDataFacade,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.configDataService.onLoading$.emit(this.isLoading);
    this.restSMSService.get().pipe(takeUntil(this.destroy$)).subscribe((res: Array<RestSMSDTO>) => {
      this.listOfDataRestSMS = res;
      this.isLoading = false;
      this.configDataService.onLoading$.emit(this.isLoading);
    }, err => {
      this.message.error('Load dữ liệu thất bại!');
    })
  }

  onAddNewData(data: TDSSafeAny) {
    const modal = this.modalService.create({
      title: 'Thêm mới dịch vụ SMS',
      content: SMSMessagesAddServiceModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md'
    });
    modal.afterOpen.subscribe(() => {

    });
    //receive result from modal after close modal
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get new changed value here
      }
    });
  }

  showEditModal(id: TDSSafeAny) {
    const modal = this.modalService.create({
      title: 'Sửa dịch vụ SMS',
      content: SMSMessagesAddServiceModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {
        dataId: id
      }
    });
    modal.afterOpen.subscribe(() => {

    });
    //receive result from modal after close modal
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData()
      }
    });
  }

  showRemoveModal(i: TDSSafeAny) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa dịch vụ SMS',
      content: 'Bạn có chắc muốn xóa dịch vụ này không?',
      iconType: 'tdsi-trash-fill',
      onOk: () => {
        //remove item here
      },
      onCancel: () => {
        modal.close();
      },
      okText: "Xác nhận",
      cancelText: "Hủy bỏ"
    });
  }
}
