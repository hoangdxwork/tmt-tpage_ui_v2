import { Observable } from 'rxjs';
import { ModalSampleMessageComponent } from './modal-sample-message/modal-sample-message.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TDSModalRef, TDSModalService, TDSHelperObject, TDSTabsCanDeactivateFn } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-send-message',
  templateUrl: './modal-send-message.component.html',
  styleUrls: ['./modal-send-message.component.scss']
})
export class ModalSendMessageComponent implements OnInit {
  formSendMessageFacebook!: FormGroup
  formSendMessageSMS!: FormGroup
  isTableSendMessageFacebook = false
  isTableSendMessageSMS = false
  isSendMessageFacebook = true
  isSendMessageSMS = false
  indexTab = 0
  tabs=[
    {id:0 , name:'Gửi tin nhắn Facebook'},
    {id:1 , name:'Gửi tin nhắn SMS'},
  ]
  dvSMS=[
    {id:0 , name:'Dịch vụ ESMS'},
    {id:1 , name:'Dịch vụ 1000SMS'},
  ]
  listSendMessageFacebook = [
    {namePartner: 'Nhi Pham', phone:'0908910425', nameFacebook: 'Nhi Pham', contentMessage: 'Tổng đơn hàng cuả bạn là: {order.total_amount}', pageFacebook: 'le`S Page'}
  ]
  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.formSendMessageFacebook = this.fb.group({
      title: new FormControl(''),
      content: new FormControl('')
    })
    this.formSendMessageSMS = this.fb.group({
      content: new FormControl(''),
    })
  }
  cancel() {
    if(this.indexTab==0){
      this.isTableSendMessageFacebook = false
    }
    else if(this.indexTab==1){
      this.isTableSendMessageSMS = false
    }
  }
  save() {
    if(this.indexTab==0){
      this.isTableSendMessageFacebook = true
    }
    else if(this.indexTab==1){
      this.isTableSendMessageSMS = true
    }
    console.log(this.isTableSendMessageSMS,this.indexTab)
  }
  submitConvert() {

  }
  sendMessage() {
    this.modal.destroy(this.submitConvert());
  }
  close() {
    this.modal.destroy(null);
  }

  // Modal tin nhắn mẫu
  showModalSampleMessage() {
    const modal = this.modalService.create({
      title: 'Danh sách mẫu tin nhắn',
      content: ModalSampleMessageComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  // xử lý gửi tin nhắn facebook
  
  // xử lý chọn title tab
  canDeactivate: TDSTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
    
    switch (fromIndex) {
      case 0:{
        this.indexTab =1
        return toIndex === 1;
      }
      case 1:{
        this.indexTab = 0
        return Promise.resolve(toIndex === 0);
      }
      default:
        return true;
    }
  };
}
