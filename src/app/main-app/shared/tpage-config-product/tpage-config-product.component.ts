import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProductPriceListService } from '../../services/product-price-list.service';
import { SharedService } from '../../services/shared.service';
import { formatDate } from '@angular/common';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';


@Component({
  selector: 'app-tpage-config-product',
  templateUrl: './tpage-config-product.component.html'
})

export class TpageConfigProductComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  lstPrices: any[] = [];
  priceListItems: any;
  shopPaymentProviders: any;

  constructor(private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productPriceListService: ProductPriceListService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef) {
      this.createForm();
  }

  ngOnInit(): void {
    this.loadListPrice();
  }

  createForm() {
    this._form = this.formBuilder.group({
      PriceList: [null, Validators.required],
    });
  }

  loadListPrice() {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.commonService.getPriceListAvailable(date).subscribe((res: any) => {
      this.lstPrices = res.value;
      let item = {};
      if(!this._form.controls['PriceList'].value) {
        item = res.value[0];
      }
      this.onChangePriceList(item);
    })
  }

  onChangePriceList(event: any) {
    this._form.controls['PriceList'].setValue(event);
  }

  onSave() {
    let model: any = this._form.controls['PriceList'].value;
    this.commonService.getPriceListItems(model.Id).subscribe((res: any) => {
      this.commonService.priceListItems$.next(res);
      this.message.success(Message.Product.UpdateListPriceSuccess);
      this.onCancel();
    });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
