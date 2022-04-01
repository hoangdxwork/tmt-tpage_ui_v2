import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TDSHelperObject, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { AddPageComponent } from '../components/add-page/add-page.component';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit { 
  inputValue?: string;

  listsfieldListSetting: any = {
    id: 1,
    name: 'Cài đặt trang hệ thống',
  }

  listsfieldListAll: any = {
    id: 1,
    name: 'Tất cả',
  }

  listAll: Array<any> = [
    {
      id: 1,
      name: 'Tất cả',
    },
    {
      id: 2,
      name: 'Đang hoạt động',
    },
    {
      id: 3,
      name: 'Người dùng đã ẩn',
    },
  ]

  listSetting: Array<any> = [
    {
      id: 2,
      name: 'Đang hoạt động',
    },
    {
      id: 3,
      name: 'Người dùng đã ẩn',
    },
  ] 

  addPage:TDSSafeAny = [
    {
      'id': '5a15b13c2340978ec3d2c0ea',
      'fullname': 'Nguyễn Thành Công',
      'page': 'Mèo nhạt nhẽo',
      'name': 'Mèo nhạt nhẽo',
    }
]


  constructor(private modal: TDSModalService,
              private modalService: TDSModalService, 
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  log(str: any){
    console.log(str)
  }

  onClickFieldListSetting(str: string) {
    this.listsfieldListSetting = str;
  }
  onClickFieldListAll(str: string) {
    this.listsfieldListAll = str;
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  } 

  error(): void {
    this.modal.error({
        title: 'Hủy kết nối Facebook',
        content: 'Bạn có chắc muốn hủy kết nối với: Mèo nhạt nhẽo',
        onOk: () => console.log(' OK'),
        onCancel:()=>{console.log('cancel')},
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
  } 

  showModalAddPage(): void {
    const modal = this.modalService.create({
        title: 'Thêm Page',
        content: AddPageComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: this.addPage
        }
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // // Return a result when closed
    // modal.afterClose.subscribe(result => {
    //     console.log('[afterClose] The result is:', result);
    //     if (TDSHelperObject.hasValue(result)) {
    //         // this.person = Object.assign(this.person, result);
    //     }
    // });
}
}
