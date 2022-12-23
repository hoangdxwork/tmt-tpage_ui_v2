import { Component, Input, OnInit } from '@angular/core';
import { CheckDuplicatePartnertDTO, CheckPartnerDTO } from '@app/dto/partner/checked-partner.dto';
import { ODataSaleOnline_OrderModel } from '@app/dto/saleonlineorder/odata-saleonline-order.dto';
import { CommonService } from '@app/services/common.service';
import { PartnerService } from '@app/services/partner.service';
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
  @Input() duplicateUser!: CheckDuplicatePartnertDTO[];

  lstOfData: Array<any> = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  viewContainerRef: any;
  isloading: boolean = false;

  constructor(
    private modal: TDSModalRef,
    private confirm: TDSModalService,
    private commonService: CommonService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private partnerService: PartnerService,
  ) { }

  ngOnInit(): void {
    if (this.duplicateUser && this.duplicateUser.length > 0) {
      this.lstOfData = this.duplicateUser.map(x => {
        x.Values.map(y => {
          let data = y.DisplayName.split(' ')
          return y.DisplayName = data[0];
        })
        return {
          ...x,
          ...{ isChecked: false }
        }

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
    this.checked = this.lstOfData.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.lstOfData.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  onAllChecked(value: TDSCheckboxChange): void {
    this.lstOfData.forEach(item => this.updateCheckedSet(item.Id, value.checked));
    this.refreshCheckedStatus();
  }

  convertCustomers(destination: CheckDuplicatePartnertDTO, user: CheckPartnerDTO): void {
    const modal = this.modalService.create({
      title: 'Xác nhận chuyển đổi',
      content: ConvertCustomersComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        desItem: destination.Values.find(x => x.Id === destination.Id),
        resItem: user
      }
    });
  }

  onSave() {
    this.isloading = true;
    let model: any[] = [];
    let ids = [...this.setOfCheckedId];

    this.duplicateUser.forEach(item => {
      let exist = ids.find(f => Number(f) == item.Id);
      if (exist) {

        let resIds: any[] = [];
        item.Values.forEach(f => {
          if (item.Id != f.Id) {
            resIds.push(f.Id);
          }
        })

        model.push({
          FromPartnerIds: resIds,
          ToPartnerId: item.Id
        })
      }
    })

    this.partnerService.transferPartnerMultiple({model}).subscribe(res => {
      this.message.success('Chuyển đổi khách hàng thành công!');
      this.isloading = false;
    },
      err => {
        this.message.error('Chuyển đổi khách hàng thất bại!');
        this.isloading = false;
      })

  }

  onCancel() {
    this.modal.close();
  }

  Confirm(): void {
    if(this.isloading){
      return
    }
    this.confirm.warning({
      title: 'Confirm',
      content: 'Bạn có xác nhận chuyển đổi?',
      onOk: () => this.onSave(),
      onCancel: () => {},
      okText: "OK",
      cancelText: "Cancel",
      confirmViewType: "compact",
    });
  }

}
