import { Component, Input, OnInit } from '@angular/core';
import { CheckPartnerDTO } from '@app/dto/partner/checked-partner.dto';
import { PartnerService } from '@app/services/partner.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-convert-customers',
  templateUrl: './convert-customers.component.html',
})
export class ConvertCustomersComponent implements OnInit {
  @Input() desItem!: CheckPartnerDTO;
  @Input() resItem!: CheckPartnerDTO;

  constructor(
    private modal: TDSModalRef,
    private partnerService : PartnerService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
  }

  save() {
    if(this.desItem && this.resItem){
      this.partnerService.transferPartner({model:{FromPartnerId: this.desItem.Id, ToPartnerId: this.resItem.Id}}).subscribe(res=>{
        this.message.success('Chuyển đổi khách hàng thành công!');
      },
      err=>{
        this.message.error('Chuyển đổi khách hàng thất bại!');
      })
    }
  }

  cancel() {
    this.modal.destroy(null);
  }

}
