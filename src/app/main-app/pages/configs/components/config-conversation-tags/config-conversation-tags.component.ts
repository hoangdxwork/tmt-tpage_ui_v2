import { EditDataModalComponent } from './edit-data-modal/edit-data-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-conversation-tags',
  templateUrl: './config-conversation-tags.component.html',
  styleUrls: ['./config-conversation-tags.component.scss']
})
export class ConfigConversationTagsComponent implements OnInit {
  TagList:Array<TDSSafeAny> = [];
  colorList:string[] = [];
  isLoading = false;

  constructor(private modalService: TDSModalService,private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
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
  }

  showEditModal(index:number): void {
    let data = this.TagList[index];
    const modal = this.modalService.create({
        title: 'Chỉnh sửa thẻ hội thoại',
        content: EditDataModalComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: {
              name:data.name,
              color:data.color,
            },
        }
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // // Return a result when closed
    // modal.afterClose.subscribe(result => {
    //     console.log('[afterClose] The result is:', result);
    //     if (TDSHelperObject.hasValue(result)) {
    //         this.colorList = Object.assign(this.colorList, result);
    //     }
    // });
  }

  doFilter(event:TDSSafeAny){
    
  }

  onAddNewTag(data:TDSSafeAny){

  }
}
