import { ModalBirthdayPartnerComponent } from './modal-birthday-partner/modal-birthday-partner.component';
import { ModalSendMessageComponent } from './modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './modal-convert-partner/modal-convert-partner.component';
import { ModalResetPointComponent } from './modal-reset-point/modal-reset-point.component';
import { ModalEditPartnerComponent } from './modal-edit-partner/modal-edit-partner.component';
import { ModalAddPartnerComponent } from './modal-add-partner/modal-add-partner.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { number } from 'echarts';
import { TDSModalService, TDSSafeAny, TDSHelperObject } from 'tmt-tang-ui';

export interface partnerDto {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  facebook: string;
  zalo:string;
  tag: string[];
  debt: number;
  status: number;
  effect: boolean;
}
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  isOpenMessageFacebook = false
  indClickTag = -1
  listSelectedTag = [
    { id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },
  ];

  public listDataTag = [
    { id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },
    { id: 3, name: 'Tag3' },
    { id: 4, name: 'Tag4' }
  ]

  firstPhone = ['097', '098', '038', '039', '037', '036', '035', '034', '090', '093', '077', '082']
  namePhone = ['Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Viettel', 'Mobifone', 'Mobifone', 'Mobifone', 'Vinaphone']
  tabsPartner = [
    {
      id: 0,
      name: 'Tất cả',
      count: 99,
      content: [

      ]
    },
    {
      id: 1,
      name: 'Thân thiết',
      count: 85,
      content: "Content of Tab Pane 2"
    },
    {
      id: 2,
      name: 'Bình thường',
      count: 80,
      content: "Content of Tab Pane 3"
    },
    {
      id: 3,
      name: 'Khách vip',
      count: 80,
      content: "Content of Tab Pane 3"
    },
    {
      id: 4,
      name: 'Bom hàng',
      count: 80,
      content: "Content of Tab Pane 3"
    }
  ];

  expandSet = new Set<number>();
  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef) { }

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly partnerDto[] = [];
  listOfData: readonly partnerDto[] = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    console.log(this.setOfCheckedId)
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly partnerDto[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit(): void {
    this.listOfData = new Array(200).fill(0).map((_, index) => ({
      id: index,
      code: `[KH0${index}]`,
      name: 'Trang Nguyen',
      phone: this.setPhone(index),
      email: '123123@gmail.com',
      tag: [],
      address: `77 Âu Cơ, Quận Tân Bình, Thành phố Hồ Chí Minh. ${index}`,
      birthday: '13/07/2021',
      zalo: '',
      facebook: 'facebook.com/100010187620290',
      debt: 12000000000,
      status: this.addStatus(index),
      effect: this.addEffect(index)
    }));
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  addEffect(id: number) {
    if (id % 2 == 0)
      return true
    return false
  }
  addStatus(id: number) {
    if (id % 3 == 0)
      return 0
    else if (id % 4) {
      return 1
    }
    return 2
  }
  setPhone(id: number) {
    if (id % 2 == 0)
      return '0369847894'
    else if (id % 3) {
      return '0908910425'
    }
    return '0822303039'
  }
  checkPhone(phone: string) {
    for (var i = 0; i < this.firstPhone.length; i++) {
      if (phone.indexOf(this.firstPhone[i]) == 0)
        return this.namePhone[i]
    }
    return
  }

  // Add tag
  addTag(id: number) {
    this.indClickTag = id;
  }
  close(): void {
    this.indClickTag = -1
    this.listSelectedTag = [{ id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },]
  }

  apply(): void {
    this.listSelectedTag.forEach(element => {
      this.listOfData[this.listOfData.findIndex(x => x.id == this.indClickTag)].tag.push(element.name)
    });
    this.indClickTag = -1
    this.listSelectedTag = [
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },];
  }

  onChange(e: TDSSafeAny) {

    console.log(e)
  }

  // modal add Partner
  showModalAddPartner(){
    const modal = this.modalService.create({
      title: 'Thêm Khách hàng',
      content: ModalAddPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        
      }
    });
  }

  // modal edit partner
  showModalEditPartner(id: number){
    const modal = this.modalService.create({
      title: 'Sửa Khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        data: this.listOfData.find(x=>x.id == id)
    }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        
      }
    });
  }
  // modal reset điểm tích lũy
  showModalResetPoint(){
    const modal = this.modalService.create({
      title: 'Reset điểm tích lũy',
      content: ModalResetPointComponent,
      size: "md",
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

  // Modal chuyển đổi khách hàng

  showModalConvertPartner(){
    const modal = this.modalService.create({
      title: 'Chuyển đổi khách hàng',
      content: ModalConvertPartnerComponent,
      size: "md",
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

  //Modal gửi tin nhắn đến khách hàng
  showModalSendMessage(){
    const modal = this.modalService.create({
      title: 'Gửi tin nhắn tới khách hàng',
      content: ModalSendMessageComponent,
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

  // Modal sinh nhật của khách hàng 
  showModalBirthday(){
    const modal = this.modalService.create({
      title: 'Sinh nhật khách hàng',
      content: ModalBirthdayPartnerComponent,
      size: "xl",
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

  // Drawer tin nhắn facebook 
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }
  closeDrawerMessage(ev: boolean){
    this.isOpenMessageFacebook = false;
  }
}
