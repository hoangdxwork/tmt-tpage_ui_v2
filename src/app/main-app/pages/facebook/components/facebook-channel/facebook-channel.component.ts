import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AddPageComponent } from '../add-page/add-page.component';
import { ConvertPageComponent } from '../convert-page/convert-page.component';

@Component({
  selector: 'facebook-channel',
  templateUrl: './facebook-channel.component.html',
})
export class FacebookChannelComponent implements OnInit {

  constructor(
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
  }

  stopPropagation(ev : TDSSafeAny) {
    ev.stopPropagation();
  }

  unConnected(ev: TDSSafeAny): void {
    ev.stopPropagation();

    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: Như Huy.`,
      onOk: () => {
        console.log("Đã hủy");
      },
      onCancel: () => {
        console.log("Chưa hủy");
      },
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  showModalAddPage(): void {
    const modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
    });
  }

  showModalConvertPage(): void {
    const modal = this.modal.create({
      title: 'Xác nhận chuyển đổi',
      content: ConvertPageComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
    });
  }

}
