import { TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalAddProductComponent } from '../components/modal-add-product/modal-add-product.component';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
})
export class AddBillComponent implements OnInit {

  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  tabsAddBill = [
    {
      name: 'Thông tin',
    },
    {
      name: 'Thông tin giao hàng',
    },
    {
      name: 'Thông tin người nhận',
    },
    {
      name: 'Thông tin Khác',
    }
  ];
  // select tên khách hàng
  public optionsInfoNamePartner = [
    { id: 1, name: 'Elton John' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
  ]
  // select tên bảng giá
  public optionsPriceList= [
    { id: 1, name: 'Bảng giá mặc định' },
    { id: 2, name: 'Bảng giá mới' }
  ]
  // select phương thức tiền
  public optionsPricemethod= [
    { id: 1, name: 'Tiền mặt' },
    { id: 2, name: 'Ngân hàng' }
  ]
  // select đối tác giao hàng
  public optionsDelivery= [
    { id: 1, name: 'GHTK' },
    { id: 2, name: 'GHN' }
  ]
  //select người bán
  public optionsSeller= [
    { id: 1, name: 'Tpos.vn' },
    { id: 2, name: 'hihi' }
  ]

  createBill = [
    {id:1 , product:'[SP1128A] Sách Harry Potter', quantity: 1, priceUnit: 100000, priceOld: 200000, discount: 0.05, weight: 100, price: 100000},
    {id:1 , product:'[SP1128A] Sách Harry Potter', quantity: 1, priceUnit: 100000, priceOld: 200000, discount: 200000, weight: 100, price: 100000}
  ]
  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  onChangeQuantity(ev: any){

  }
  onChangePriceUnit(ev : any){

  }

  openPopoverDiscount(){
    this.visiblePopoverDiscount = true
  }
  closePopoverDiscount(){
    this.visiblePopoverDiscount = false
  }
  applyPopoverDiscount(){
    this.visiblePopoverDiscount = false
  }

  openPopoverTax(){
    this.visiblePopoverTax = true
  }
  closePopoverTax(){
    this.visiblePopoverTax = false
  }
  applyPopoverTax(){
    this.visiblePopoverTax = false
  }

  showModalSearchPartner(){
    const modal = this.modalService.create({
      title: 'Tìm kiếm khách hàng',
      content: ModalSearchPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }
  showModalAddProduct(){
    const modal = this.modalService.create({
      title: 'Thêm sản phẩm',
      content: ModalAddProductComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }
}
