import { AddServiceModalComponent } from './add-service-modal/add-service-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-sms-messages',
  templateUrl: './config-sms-messages.component.html',
  styleUrls: ['./config-sms-messages.component.scss']
})
export class ConfigSmsMessagesComponent implements OnInit {
  TableData:Array<TDSSafeAny> = [];

  isLoading = false;

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.TableData = [
      {
        id:1,
        partner:'ESMS',
        APIKey:'4DFAA62B2B86A614B6F3F9820',
        service:'Dịch vụ Internet',
      },
      {
        id:2,
        partner:'SpeedSMS',
        APIKey:'4DFAA62B2B86A614B6F3F9820',
        service:'Gửi bằng đầu số ngẫu nhiên',
      },
      {
        id:3,
        partner:'ESMS',
        APIKey:'4DFAA62B2B86A614B6F3F9820',
        service:'Gửi tin nhắn SMS',
      },
      {
        id:4,
        partner:'SpeedSMS',
        APIKey:'4DFAA62B2B86A614B6F3F9820',
        service:'Tin nhắn gửi bằng brandname',
      },
    ];
  }

  onAddNewData(data:TDSSafeAny){
    const modal = this.modalService.create({
        title: 'Thêm mới dịch vụ SMS',
        content: AddServiceModalComponent,
        viewContainerRef: this.viewContainerRef,
        size:'md'
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

  showEditModal(i:number){
    
  }

  showRemoveModal(i:number){
    const modal = this.modalService.error({
      title: 'Xác nhận xóa dịch vụ SMS',
      content: 'Bạn có chắc muốn xóa dịch vụ này không?',
      iconType:'tdsi-trash-fill',
      onOk: () => {
        //remove item here
      },
      onCancel:()=>{
        modal.close();
      },
      okText:"Xác nhận",
      cancelText:"Hủy bỏ"
  });
  }
}
