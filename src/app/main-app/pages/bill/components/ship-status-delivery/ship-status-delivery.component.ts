import { DeliveryCarrierService } from './../../../../services/delivery-carrier.service';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'ship-status-delivery',
  templateUrl: './ship-status-delivery.component.html'
})

export class ShipStatusDeliveryComponent implements OnInit, OnDestroy {
  base64textString!: string;
  urlSampleUrl!: string;
  isUpdate: boolean = false;
  messageError: any[] = [];
  listDeliveryCarrier: any[] = [];

  isLoading: boolean = false;
  _form!:FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private deliveryCarrierService: DeliveryCarrierService,
    private fb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit(): void {
    this.urlSampleUrl = this.fastSaleOrderService.urlSampleShipStatusDelivery();
    this.loadCarrier();
  }

  createForm(){
    this._form = this.fb.group({
      CarrierId:[null,Validators.required],
      Payment:[true],
      FileName:[null,Validators.required],
      Note:[""]
    })
  }

  loadCarrier(){
    this.deliveryCarrierService.dataCarrierActive$.subscribe((res) => {
      this.listDeliveryCarrier = res;
    });
  }

  handleFileInput(event: any) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      let reader = new FileReader();
      this._form.controls["FileName"].setValue(file.name);

      reader.onload = this.handleReaderBtoa.bind(this);
      reader.readAsBinaryString(file);

      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  handleReaderBtoa(readerEvt: any) {
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  openUrlSample() {
    window.open(this.urlSampleUrl, '_self');
  }

  onSave(): any {
    let that = this;
    if(!TDSHelperString.hasValueString(that.base64textString)) {
      return that.message.error('Vui lòng chọn file');
    }

    this.isLoading = true;
    let model = {
      carrierId: this._form.controls["CarrierId"].value,
      file: that.base64textString,
      note: this._form.controls["Note"].value,
      payment: this._form.controls["Payment"].value
    };
    console.log(model)
    that.fastSaleOrderService.updateExistShipCode(model).pipe(takeUntil(this.destroy$), finalize(() =>  this.isLoading = false ))
      .pipe()
      .subscribe((res: any) => {
        this.message.success('Cập nhật đối soát thành công. Vui lòng kiểm tra lại những dòng bị lỗi');
        this.messageError = res.value;
      }, error => {
        this.message.error(error.error.message || 'Lỗi dữ liệu');
      });
  }

  onClose() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
