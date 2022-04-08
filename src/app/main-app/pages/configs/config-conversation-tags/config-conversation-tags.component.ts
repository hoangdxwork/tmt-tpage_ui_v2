import { FormControl } from '@angular/forms';
import { AutoChatEditTagDataModalComponent } from '../components/auto-chat-edit-tag-data-modal/auto-chat-edit-tag-data-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-conversation-tags',
  templateUrl: './config-conversation-tags.component.html',
  styleUrls: ['./config-conversation-tags.component.scss']
})
export class ConfigConversationTagsComponent implements OnInit {
  filterForm!:FormControl;
  TableData:Array<TDSSafeAny> = [];
  TagList:Array<TDSSafeAny> = [];
  colorList:string[] = [];
  isLoading = false;

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.filterForm = new FormControl('');
    this.loadData();
  }

  loadData(){
    this.TagList = [
      {
        id:1,
        name:'Bom hàng',
        color:'#F33240',
        usedTime:4,
        status:true,
      },
      {
        id:2,
        name:'Test',
        color:'#B5076B',
        usedTime:1,
        status:true,
      },
      {
        id:3,
        name:'Giao hàng',
        color:'#A70000',
        usedTime:2,
        status:true,
      },
      {
        id:4,
        name:'Chậm trễ',
        color:'#FF8900',
        usedTime:1,
        status:true,
      },
      {
        id:5,
        name:'Khách khó',
        color:'#FFC400',
        usedTime:4,
        status:true,
      },
      {
        id:6,
        name:'Hoàn thành',
        color:'#28A745',
        usedTime:6,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
      {
        id:7,
        name:'Khách VIP',
        color:'#00875A',
        usedTime:3,
        status:true,
      },
    ];

    this.TableData = this.TagList;
  }

  showEditModal(index:number): void {
    let data = this.TagList[index];
    const modal = this.modalService.create({
        title: 'Chỉnh sửa thẻ hội thoại',
        content: AutoChatEditTagDataModalComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            //send data to edit modal
            data: {
              name:data.name,
              color:data.color,
            },
        }
    });
    modal.afterOpen.subscribe(() => {

    });
    //receive result from edit modal after close modal
    modal.afterClose.subscribe(result => {
        if (TDSHelperObject.hasValue(result)) {
          //get new changed value
            this.TagList[index] = Object.assign(this.TagList[index],result);
            //edit item here
        }
    });
  }

  showRemoveModal(index:number): void {
    const modal = this.modalService.error({
        title: 'Xác nhận xóa thẻ',
        content: 'Bạn có chắc muốn xóa thẻ này không?',
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

  doFilter(event:TDSSafeAny){
    this.TableData = this.TagList;
  }

  onAddNewTag(data:TDSSafeAny){

  }
}
