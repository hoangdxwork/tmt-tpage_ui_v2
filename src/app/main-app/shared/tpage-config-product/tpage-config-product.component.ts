import { finalize } from 'rxjs/operators';
import { TDSSafeAny, TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { format } from 'date-fns';
import { ProductPriceListService } from '../../services/product-price-list.service';
import { StockWarehouseService } from '../../services/stock-warehouse.service';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'app-tpage-config-product',
  templateUrl: './tpage-config-product.component.html'
})
export class TpageConfigProductComponent implements OnInit {

  @Output() onSaveConfig = new EventEmitter<any>();

  formConfigProduct!: FormGroup;

  isLoading: boolean = false;

  lstPriceLists: Array<any> = [];
  lstWareHouses: Array<any> = [];

  itemPriceLists: any;
  itemWareHouses: any;

  dataPriceLists: any;
  dataWareHouses: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productPriceListService: ProductPriceListService,
    private stockWarehouseService: StockWarehouseService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  createForm() {
    this.formConfigProduct = this.formBuilder.group({
      PriceList: [null, Validators.required],
      WareHouse: [],
    });
  }

  loadData() {
    this.commonService.dataPriceLists$.subscribe(res => {
      this.dataPriceLists = res;
    });

    let dateNow = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");

    this.loadPriceList(dateNow);
    this.loadWareHouses();
  }

  loadPriceList(dateNow: any) {
    this.isLoading = true;
    this.productPriceListService.getPriceListAvailable(dateNow)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        if(res && res.value && res.value.length > 0) {
          this.lstPriceLists = res.value;

          let valueDefault = this.lstPriceLists[0];

          this.formConfigProduct.controls['PriceList'].setValue(valueDefault);
          this.changePriceList(valueDefault);
        }
      });
  }

  loadWareHouses() {
    this.stockWarehouseService.getByCompany().subscribe((res: any) => {
      this.lstWareHouses = res.value;

      let valueDefault = this.lstWareHouses[0];

      this.changeWareHouse(valueDefault);
      this.formConfigProduct.controls['WareHouse'].setValue(valueDefault);
    });
  }

  changePriceList(event: TDSSafeAny) {
    this.itemPriceLists = event;
  }

  changeWareHouse(event: TDSSafeAny) {
    this.itemWareHouses = event;
  }

  onSave() {
    let model: any = {};

    let valueForm = this.formConfigProduct.value;

    model["PriceList"] = valueForm.PriceList;
    model["WareHouse"] = valueForm.WareHouse;

    if(!this.dataPriceLists || !this.dataPriceLists[this.itemPriceLists.Id]) {
      this.commonService.getPriceListItems(this.itemPriceLists.Id).subscribe((res: any) => {

        this.dataPriceLists[this.itemPriceLists.Id] = res;
        this.dataPriceLists["currentId"] = this.itemPriceLists.Id;
        this.commonService.dataPriceLists$.next(this.dataPriceLists);
      });
    }
    else {
      this.dataPriceLists["currentId"] = this.itemPriceLists.Id;
      this.commonService.dataPriceLists$.next(this.dataPriceLists);
    }

    this.message.success(Message.Product.UpdateListPriceSuccess);

    this.onCancel();
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
