import { TDSModalRef } from 'tds-ui/modal';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-update-delivery-from-excel',
  templateUrl: './modal-update-delivery-from-excel.component.html'
})
export class ModalUpdateDeliveryFromExcelComponent implements OnInit {
// updateDeliveryExcel
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
      return that.message.error('Vui lòng chọn file');
    }

    this.isLoading = true;
    let model = {
      file: that.base64textString
    };

    that.fastSaleOrderService.updateDeliveryExcel(model).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() =>  this.isLoading = false ))
      .subscribe((res: any) => {
    }, error => {})
  }

  onClose() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
