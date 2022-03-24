import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tmt-tang-ui';
interface SampleMessageDto{
  id: number;
  name: string;
  content: string
}

@Component({
  selector: 'app-modal-sample-message',
  templateUrl: './modal-sample-message.component.html',
  styleUrls: ['./modal-sample-message.component.scss']
})
export class ModalSampleMessageComponent implements OnInit {

  listSampleMessage!: SampleMessageDto[]
  constructor(private modal: TDSModalRef,) { }

  ngOnInit(): void {
    this.listSampleMessage = [
      {id: 1, name: 'Công nợ', content:'{partner.debt}'},
      {id: 2, name: 'Tổng tiền đơn hàng', content:'{{order.total_amount}}'},
      {id: 3, name: 'Mã vận đơn', content:'{order.tracking_code}'},
      {id: 4, name: 'Số điện thoại', content:'{partner.phone}'},
      {id: 5, name: 'Mã đặt hàng', content:'{placeholder.code}'},

    ]
  }
  cancel(){
    this.modal.destroy(null)
  }
}
