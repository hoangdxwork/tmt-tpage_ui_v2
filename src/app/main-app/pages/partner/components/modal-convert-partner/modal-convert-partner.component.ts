import { PartnerDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { takeUntil } from 'rxjs/operators';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-convert-partner',
  templateUrl: './modal-convert-partner.component.html',
  providers: [TDSDestroyService]
})

export class ModalConvertPartnerComponent implements OnInit {

  @Input() lstOfData!: PartnerDTO[];
  @Output() onCloseModel: EventEmitter<any> = new EventEmitter<any>();

  fromPartner: { Id: number, Name: string } = { Id: 0, Name: '' };
  toPartner: { Id: number, Name: string } = { Id: 0, Name: '' };;

  constructor(private modal: TDSModalRef,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private destroy$: TDSDestroyService,
    private partnerService: PartnerService) { }

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

    this.partnerService.transferPartner({model: model}).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
            this.message.success('Chuyển đổi khách hàng thành công!');
            this.modalService.success({
                title: 'Xóa dữ liệu khách hàng đích',
                content: 'Bạn có muốn xóa dữ liệu khách hàng đích?',
                onOk: () => {
                    this.partnerService.delete(this.fromPartner.Id).subscribe({
                      next: (resDel: TDSSafeAny) => {
                        this.message.success('Xóa thành công!');
                        this.onCloseModel.emit("onLoadPage");
                      },
                      error: (error) => {
                        this.message.error(`Xóa khách hàng đích đã xảy ra lỗi!`);
                        this.onCloseModel.emit(null);
                      }
                    })
                },
                onCancel: () => { },
                okText: "Xác nhận",
                cancelText: "Đóng",
                confirmViewType:"compact"
            });
            this.modal.destroy(res);
        }
      },
      error: (error) => {
        this.message.error('Chuyển đổi khách hàng thất bại!');
        this.modal.destroy(null);
      }
    })
  }

  changeFrom(event: any) {
    let exits = this.lstOfData.filter((x: any) => x.Id == Number(event))[0];

    if(exits) {
      this.fromPartner.Id = exits.Id;
      this.fromPartner.Name = exits.Name;
    }
  }

  changeTo(event: any) {
    let exits = this.lstOfData.filter((x: any) => x.Id == Number(event))[0];

    if(exits) {
      this.toPartner.Id = exits.Id;
      this.toPartner.Name = exits.Name;
    }
  }
}
