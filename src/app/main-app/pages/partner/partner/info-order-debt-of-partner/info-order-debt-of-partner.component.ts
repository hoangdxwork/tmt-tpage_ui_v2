import { ModalPaymentComponent } from './../modal-payment/modal-payment.component';
import { TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { partnerDto } from '../partner.component';
interface orderDTO{
  code: string;
  createdDate: string;
  type: string;
  creator: string;
  source: string;
  status: number;
  totalPrice: number;
}
interface debtDetailDTO{
  date: string,
  invoiceVoucher: string;
  debt: number
}
interface infoPartnerDto {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  facebook: string;
  zalo:string;
  groupPartner: string;
  codeTax: string;
  status: number;
  saleFirst: number;
  sale: number;
  totalSale: number
}

@Component({
  selector: 'app-info-order-debt-of-partner',
  templateUrl: './info-order-debt-of-partner.component.html',
  styleUrls: ['./info-order-debt-of-partner.component.scss']
})
export class InfoOrderDebtOfPartnerComponent implements OnInit {

  @Input() dataPartner!: partnerDto
  ListOrder !: orderDTO[]
  listdebtDetail !: debtDetailDTO[]
  tabsDetailPartner = [
    {
      id: 0,
      name: 'Thông tin',
    },
    {
      id: 1,
      name: 'Hóa đơn',
    },
    {
      id: 2,
      name: 'Chi tiết nợ',
    }
  ];

  infoPartner !: infoPartnerDto
  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    ) { }

  ngOnInit(): void {
    this.infoPartner= {
      code: this.dataPartner.code,
      name: this.dataPartner.name,
      phone: this.dataPartner.phone,
      email: this.dataPartner.email,
      birthday: this.dataPartner.birthday,
      address: this.dataPartner.address,
      facebook: this.dataPartner.facebook,
      zalo: '',
      groupPartner: 'Nhóm 1',
      codeTax: '',
      status: this.dataPartner.status,
      saleFirst: 0,
      sale : 37653003,
      totalSale: 37653003,
    }
    this.ListOrder = [
      {code: 'INV/2021/0241', createdDate: '11/06/2021', type:'Bán hàng',creator:'TMTHIHIHI',source:'TPOS',status:2,totalPrice:25000000},
      {code: 'INV/2021/0241', createdDate: '11/06/2021', type:'Bán hàng',creator:'TMTHIHIHI',source:'TPOS',status:0,totalPrice:25000000},
      {code: 'INV/2021/0241', createdDate: '11/06/2021', type:'Bán hàng',creator:'TMTHIHIHI',source:'TPOS',status:1,totalPrice:25000000},
      {code: 'INV/2021/0241', createdDate: '11/06/2021', type:'Bán hàng',creator:'TMTHIHIHI',source:'TPOS',status:3,totalPrice:25000000},
      {code: 'INV/2021/0241', createdDate: '11/06/2021', type:'Bán hàng',creator:'TMTHIHIHI',source:'TPOS',status:0,totalPrice:25000000},
    ]
    this.listdebtDetail =[
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
      {date:'11/06/2021',invoiceVoucher:'CSH1/2020/0024 - pos2/0444: - POS/2020/02/18/130 - POS/2020/02/18/130',debt:2500000},
    ]
  }

  showModalPayment(){
    const modal = this.modalService.create({
      title: 'Đăng ký thanh toán',
      content: ModalPaymentComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        //data : this.infoPartner 
      }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }
}
