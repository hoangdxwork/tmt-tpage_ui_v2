import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { StoragePriceListItemsDto } from './../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '@app/services/product-indexdb.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProductPriceListService } from '../../services/product-price-list.service';
import { SharedService } from '../../services/shared.service';
import { formatDate } from '@angular/common';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';


@Component({
  selector: 'app-tpage-config-product',
  templateUrl: './tpage-config-product.component.html',
  providers: [TDSDestroyService]
})

export class TpageConfigProductComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  lstPrices: any[] = [];
  priceListItems!: StoragePriceListItemsDto;
  shopPaymentProviders: any;

  constructor(private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productIndexDBService: ProductIndexDBService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private destroy$: TDSDestroyService) {
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
    this.isLoading = true;
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.commonService.getPriceListAvailable(date).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstPrices = res.value;
          this.setPriceListItem();

          this.isLoading = false;
      }, 
      error: error => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
      }
    })
  }

  setPriceListItem() {debugger
    this.priceListItems = this.productIndexDBService.getStoragePriceListItems();
    if(this.priceListItems && this.priceListItems.Id) {
        let item = this.lstPrices.filter(x=> x.Id == this.priceListItems.Id)[0];
        this._form.controls['PriceList'].setValue(item);
    } else if(this.lstPrices.length > 0){
        this._form.controls['PriceList'].setValue(this.lstPrices[0]);
    }
  }

  onChangePriceList(event: any) {
    this._form.controls['PriceList'].setValue(event);
  }

  onSave() {
    if(!this._form?.valid) {
        this.message.success('Vui lòng chọn bảng giá');
    }

    if(this.isLoading) return;

    this.isLoading = true;

    let model: any = this._form.controls['PriceList'].value;
    this.commonService.getPriceListItems(model.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
            let item = {
              Id: model.Id,
              Value: res
            } as StoragePriceListItemsDto;
            this.productIndexDBService.setStoragePriceListItems(item);

            this.message.success(Message.Product.UpdateListPriceSuccess);
            this.onCancel(item);
            this.isLoading = false;
          }
      }, 
      error : error => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
      }
    });
  }

  onCancel(item?: StoragePriceListItemsDto) {
    this.modalRef.destroy(item);
  }

}
