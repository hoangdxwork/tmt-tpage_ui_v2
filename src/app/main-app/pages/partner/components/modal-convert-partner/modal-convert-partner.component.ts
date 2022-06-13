import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TDSMessageService, TDSModalRef, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-convert-partner',
  templateUrl: './modal-convert-partner.component.html'
})

export class ModalConvertPartnerComponent implements OnInit {

  formConvertPartner!: FormGroup
  @Input() lstOfData: any[] = [];

  fromPartner: any = { Id: 0, Name: null };
  toPartner: any = { Id: 0, Name: null };

  constructor(private modal: TDSModalRef,
    private odataPartnerService: OdataPartnerService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private partnerService: PartnerService,
    private fb : FormBuilder) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    let model = {
      FromPartnerId: this.fromPartner.Id,
      ToPartnerId: this.toPartner.Id
    }

    this.partnerService.transferPartner({model: model}).subscribe((res: any) => {
        if(res) {
            this.message.success('Chuyển đổi khách hàng thành công!');
            this.modalService.success({
                title: 'Xóa dữ liệu khách hàng đích',
                content: 'Bạn có muốn xóa dữ liệu khách hàng đích?',
                onOk: () => {
                    this.partnerService.delete(this.fromPartner.Id).subscribe((res: TDSSafeAny) => {
                        this.message.success('Xóa thành công!');
                    }, error => {
                      this.message.error(`Xóa khách hàng đích đã xảy ra lỗi!`);
                    })
                },
                onCancel: () => { },
                okText: "Xác nhận",
                cancelText: "Đóng",
                confirmViewType:"compact"
            });
        }

        this.modal.destroy(null);
    }, error => {
      this.message.error('Chuyển đổi khách hàng thất bại!');
      this.modal.destroy(null);
    })
  }

  changeFrom(event: any) {
    let exits = this.lstOfData.filter((x: any) => x.Id == event)[0]
    if(exits) {
      this.fromPartner.Id = exits.Id;
      this.fromPartner.Name = exits.Name;
    }
  }

  changeTo(event: any) {
    let exits = this.lstOfData.filter((x: any) => x.Id == event)[0]
    if(exits) {
      this.toPartner.Id = exits.Id;
      this.toPartner.Name = exits.Name;
    }
  }
}
