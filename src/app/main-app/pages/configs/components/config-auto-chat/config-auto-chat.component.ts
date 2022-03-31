import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-auto-chat',
  templateUrl: './config-auto-chat.component.html',
  styleUrls: ['./config-auto-chat.component.scss']
})
export class ConfigAutoChatComponent implements OnInit {
  AutoChatList:Array<TDSSafeAny> = [];
  expandBtnList:Array<boolean> = [];
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.AutoChatList = [
      {
        id:1,
        name:'Yêu cầu gửi số điện thoại',
        content:'{required.phone}',
        shortcut:'#',
        status:true,
      },
      {
        id:2,
        name:'Yêu cầu địa chỉ',
        content:'{required.address}',
        shortcut:'#',
        status:true,
      },
      {
        id:3,
        name:'Cảm ơn',
        content:'Xin chào, {partner.name} Cảm ơn bạn đã đặt hàng tại shop!!! ...',
        shortcut:'#',
        status:true,
      },
      {
        id:4,
        name:'Đặt hàng',
        content:'{partner.phone}{partner.address}{order}{placeholder.note}',
        shortcut:'#',
        status:true,
      },
      {
        id:5,
        name:'Tag',
        content:'{tag}',
        shortcut:'#',
        status:true,
      },
      {
        id:6,
        name:'Yêu cầu đặt hàng',
        content:'{partner.name}{partner.code}{partner.code}{order}',
        shortcut:'#',
        status:true,
      },
      {
        id:7,
        name:'Mã đặt hàng',
        content:'{placeholder.code}',
        shortcut:'#',
        status:true,
      },
      {
        id:8,
        name:'Thanh toán',
        content:'{partner.code}{order}{order.tracking_code}{order.total_amount}{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
      {
        id:9,
        name:'Chi tiết đơn hàng',
        content:'{placeholder.details}',
        shortcut:'#',
        status:true,
      },
    ];

    this.setExpandBtnStatus();
  }

  setExpandBtnStatus(){
    let i = 0;
    while(i < (this.AutoChatList.length-1)){
      this.expandBtnList.push(false);
      i++;
    }
  }

  doFilter(event:TDSSafeAny){
    
  }

  onAddNewTag(data:TDSSafeAny){

  }

  onChangeStatus(value:boolean,index:number){

  }

  onChangeSetting(data:TDSSafeAny,index:number){
    
  }

  onEditRow(data:TDSSafeAny,index:number){

  }

  onRemoveRow(index:number){

  }
}
