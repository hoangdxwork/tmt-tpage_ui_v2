import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'ship-status-delivery',
  templateUrl: './ship-status-delivery.component.html'
})

export class ShipStatusDeliveryComponent implements OnInit, OnDestroy {

  base64textString!: string;
  urlSampleUrl!: string;
  isUpdate: boolean = false;
  messageError: any[] = [];
  lstOrder: any = [];

  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.urlSampleUrl = this.fastSaleOrderService.urlSampleShipStatusDelivery();
  }

  handleFileInput(event: any) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      let reader = new FileReader();

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
      return  that.message.error('Vui lòng chọn file');
    }

    this.isLoading = true;
    let model = {
      // carrierId: 4,
      // file: that.base64textString,
      // isNoteOrder: true,
      // note: '',
      // payment: true
    };

    that.fastSaleOrderService.updateExistShipCode(model).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() =>  this.isLoading = false ))
      .subscribe((res: any) => {
    }, error => {
    })
  }

  onClose() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
