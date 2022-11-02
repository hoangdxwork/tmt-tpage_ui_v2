import { takeUntil } from 'rxjs/operators';
import { RestSMSDTO } from './../../../dto/sms/sms.dto';
import { RestSMSService } from './../../../services/sms.service';
import { SMSServiceModalComponent } from '../components/sms-service-modal/sms-service-modal.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

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
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.restSMSService.get().pipe(takeUntil(this.destroy$)).subscribe((res: Array<RestSMSDTO>) => {
      this.listOfDataRestSMS = [...res];
      res.forEach(item => {
        if(item.CustomProperties){
          let service = this.getCustomProperties(item.CustomProperties);
          item.CustomProperties = service
        }
      });
      this.isLoading = false;
    }, err => {
      this.message.error('Load dữ liệu thất bại!');
    })
  }

  getCustomProperties(data:TDSSafeAny){
    let obj = JSON.parse(JSON.stringify(data));
    if(JSON.parse(obj)?.type){
      return JSON.parse(obj).type?.datasource;
    }else{
      this.getCustomProperties(obj);
    }
  }

  onAddNewData(data: TDSSafeAny) {
    const modal = this.modalService.create({
      title: 'Thêm mới dịch vụ SMS',
      content: SMSServiceModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md'
    });
  }

  showEditModal(id: TDSSafeAny) {
    const modal = this.modalService.create({
      title: 'Sửa dịch vụ SMS',
      content: SMSServiceModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {
        dataId: id
      }
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
