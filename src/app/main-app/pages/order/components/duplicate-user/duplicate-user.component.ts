import { Component, Input, OnInit } from '@angular/core';
import { PartnerStatusDTO } from '@app/dto/partner/partner.dto';
import { ODataSaleOnline_OrderModel } from '@app/dto/saleonlineorder/odata-saleonline-order.dto';
import { CommonService } from '@app/services/common.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSCheckboxChange } from 'tds-ui/tds-checkbox';
import { ConvertCustomersComponent } from '../convert-customers/convert-customers.component';

@Component({
  selector: 'duplicate-user',
  templateUrl: './duplicate-user.component.html'
})
export class DuplicateUserComponent implements OnInit {
  @Input() duplicateUser: Array<any> = [];
  // lstPartnerStatus!: Array<any>;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  viewContainerRef: any;
  temptItem: any = [];


  constructor(
    private modal: TDSModalRef,
    private commonService: CommonService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
  ) { }

  ngOnInit(): void {
    if (this.duplicateUser && this.duplicateUser.length > 0) {
      this.duplicateUser.forEach(x => {
        x["isChecked"] = false;
      })
    };
  }

  onItemChecked(id: string, value: TDSCheckboxChange): void {
    this.updateCheckedSet(id, value.checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.duplicateUser.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.duplicateUser.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  onAllChecked(value: TDSCheckboxChange): void {
    this.duplicateUser.forEach(item => this.updateCheckedSet(item.Id, value.checked));
    this.refreshCheckedStatus();
  }

  convertCustomers(item : any, user: any): void {
    // if(item[0].Id === user.Id) {
    //   this.temptItem = item[0];
    // }
    // debugger
    this.temptItem = item[0];
    const modal = this.modalService.create({
      title: 'Xác nhận chuyển đổi',
      content: ConvertCustomersComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        x: this.temptItem,
        y: user
      }
    });
  }

  onSave() {

  }

  onCancel() {
    this.modal.close();
  }

}
