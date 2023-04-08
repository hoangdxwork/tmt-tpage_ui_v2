import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSNotificationService } from 'tds-ui/notification';
import { ModalManualUpdateDeliveryComponent } from './../modal-manual-update-delivery/modal-manual-update-delivery.component';
import { ModalUpdateDeliveryFromExcelComponent } from './../modal-update-delivery-from-excel/modal-update-delivery-from-excel.component';
import { ShipCodeDeliveryComponent } from './../ship-code-delivery/ship-code-delivery.component';
import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { GenerateMessageTypeEnum } from './../../../../dto/conversation/message.dto';
import { CrossCheckingStatusComponent } from '../cross-checking-status/cross-checking-status.component';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { finalize, map, takeUntil } from "rxjs/operators";
import { OperatorEnum } from "src/app/lib";
import { ExcelExportService } from "src/app/main-app/services/excel-export.service";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { PrinterService } from "src/app/main-app/services/printer.service";
import { PaymentMultipComponent } from "../payment-multip/payment-multip.component";
import { PaymentRequestComponent } from "../payment-request/payment-request.component";
import { SendDeliveryComponent } from "../send-delivery/send-delivery.component";
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { ModalPaymentComponent } from '../../../partner/components/modal-payment/modal-payment.component';
import { FastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { ShipStatusDeliveryComponent } from '../ship-status-delivery/ship-status-delivery.component';
import { ModalBatchRefundComponent } from '../modal-batch-refund/modal-batch-refund.component';

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
  providers: [TDSDestroyService]
})

export class ActionDropdownComponent implements OnInit {

  @Input() filterObj: any;
  @Input() setOfCheckedId: any = [];
  @Input() lstOfData: FastSaleOrderDTO[] = [];
  @Input() type!: string;

  isProcessing: boolean = false;
  isLoading: boolean = false;
  tagIds: any = [];
  idsModel: any = [];
  params!: TDSSafeAny;
  modalReference: any;

  constructor(private router: Router,
    private modal: TDSModalService,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private notification: TDSNotificationService,
    private viewContainerRef: ViewContainerRef,
    private excelExportService: ExcelExportService,
    private printerService: PrinterService,
    private destroy$: TDSDestroyService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.params = res;
      }
    })
  }

  exportExcel(type: string): any {
    if (this.isProcessing) return;

    this.fastSaleOrderService.checkPrermissionBill().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          let ids: any[] = [...this.setOfCheckedId][0];
          this.idsModel = [...ids];

          let dateStart = this.filterObj.dateRange.startDate;
          let dateEnd = this.filterObj.dateRange.endDate;
          let liveCampaignId = this.filterObj.liveCampaignId;
          this.tagIds = this.filterObj.tags;

          let data = {
            Filter: {
              logic: "and",
              filters: [
                { field: "Type", operator: OperatorEnum.eq, value: "invoice" },
                { field: "DateInvoice", operator: "gte", value: dateStart },
                { field: "DateInvoice", operator: "lte", value: dateEnd },
                {
                  logic:"or",
                  filters:[
                     {
                        field: "LiveCampaignId",
                        operator: "eq",
                        value: liveCampaignId
                     }
                  ]
               }
              ],
            },
          };

          if(TDSHelperString.hasValueString(this.filterObj.hasTracking)) {
            if(this.filterObj.hasTracking === "isCode"){
                data.Filter.filters.push({ field: "TrackingRef", operator: OperatorEnum.neq, value: null })
            }
            if(this.filterObj.hasTracking === "noCode"){
                data.Filter.filters.push({ field: "TrackingRef", operator: OperatorEnum.eq, value: null })
            }
          }

          if(TDSHelperString.hasValueString(this.filterObj.shipPaymentStatus)) {
              data.Filter.filters.push({ field: "ShipPaymentStatus", operator: OperatorEnum.eq, value: this.filterObj.shipPaymentStatus })
          }

          if (TDSHelperArray.hasListValue(this.filterObj.status)) {
            data.Filter.filters.push({
                filters: this.filterObj.status.map((x:any) => ({
                    field: "State",
                    operator: "eq",
                    value: x,
                })),

                logic: "or"
            })
          }

          if(this.filterObj.carrierId && this.filterObj.carrierId > 0) {
            data.Filter.filters.push({ field: "CarrierId", operator: OperatorEnum.eq, value: this.filterObj.carrierId })
          }

          if (TDSHelperString.hasValueString(this.filterObj?.searchText)) {
            let value = TDSHelperString.stripSpecialChars(this.filterObj?.searchText.toLowerCase().trim())
            data.Filter.filters.push( {
                filters: [
                  { field: "PartnerDisplayName", operator: OperatorEnum.contains, value: value },
                  { field: "Phone", operator: OperatorEnum.contains, value: value },
                  { field: "Address", operator: OperatorEnum.contains, value: value },
                  { field: "Number", operator: OperatorEnum.contains, value: value },
                  { field: "PartnerNameNoSign", operator: OperatorEnum.contains, value: value },
                  { field: "CarrierName", operator: OperatorEnum.contains, value: value},
                  { field: "TrackingRef", operator: OperatorEnum.contains, value: value}
                ],
                logic: 'or'
            })
          }

          switch (type) {
            case "excels":
              this.isProcessing = true;
              this.excelExportService.exportPost(`/fastsaleorder/ExportFile?TagIds=${this.tagIds}`,
                  { data: JSON.stringify(data), ids: this.idsModel }, 'ban-hang')
                  .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
                  .subscribe();
              break;

            case "invoice":
                this.isProcessing = true;
                this.excelExportService.exportPost(`/fastsaleorder/ExportFileDetail?TagIds=${this.tagIds}&type=invoice`,
                    { data: JSON.stringify(data), ids: this.idsModel }, "ban-hang-chi-tiet")
                    .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
                    .subscribe();
              break;

            case "lineproducts":
                this.isProcessing = true;
                this.excelExportService.exportPost(`/fastsaleorder/ExportDetailLineByLine?TagIds=${this.tagIds}&type=invoice`,
                    { data: JSON.stringify(data), ids: this.idsModel }, "ban-hang-chi-tiet-tung-dong")
                    .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
                    .subscribe();
              break;

            case "products":
                this.isProcessing = true;
                this.excelExportService.exportPost(`/fastsaleorder/ExportFileOrderDetailByStatus?TagIds=${this.tagIds}`,
                    { data: JSON.stringify(data), ids: this.idsModel }, "danh-sach-san-pham-don-hang")
                    .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
                    .subscribe();
              break;

            default:
              break;
          }
      }, error: (error: any) => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  print(type: string) {
    let that = this;
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let obs: TDSSafeAny;
      switch (type) {
        case "print":
          obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.idsModel}`);
          break;
        case "printShips":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.idsModel}`);
          break;
        case "printDeliveries":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.idsModel}`);
          break;
      }

      if (TDSHelperObject.hasValue(obs)) {
        this.isProcessing = true;
        obs.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              that.printerService.printHtml(res);
              this.isProcessing = false;
          },
          error: (error: any) => {
            let err: any;

            if(typeof(error) === "string") {
              err = JSON.parse(error) as any;
            } else {
              err = error;
            }

            this.isProcessing = false;
            this.message.error(err?.error?.message || err?.message);
          }
        })
      }
    }
  }

  showMessageModal() {
    if (this.checkValueEmpty()) {
      this.modal.create({
        title: 'Gửi tin nhắn Facebook',
        size: 'lg',
        content: SendMessageComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          selectedUsers: this.idsModel,
          messageType: GenerateMessageTypeEnum.Bill
        }
      });
    }
  }

  onCreate() {
    this.router.navigateByUrl('bill/create');
  }

  manualCrossChecking() {
    this.modal.create({
      title: 'Đối soát giao hàng thủ công',
      size: 'xl',
      content: CrossCheckingStatusComponent,
      viewContainerRef: this.viewContainerRef
    });
  }

  updateShipCodeDelivery() {
    this.modal.create({
      title: 'Cập nhật mã vận đơn từ file',
      size: 'xl',
      content: ShipCodeDeliveryComponent,
      viewContainerRef: this.viewContainerRef
    });
  }

  updateShipStatusDelivery() {
    this.modal.create({
      title: 'Đối soát giao hàng từ file',
      size: 'lg',
      content: ShipStatusDeliveryComponent,
      viewContainerRef: this.viewContainerRef
    });
  }

  manualUpdateDelivery() {
    if (this.checkValueEmpty()) {
      let datas = this.lstOfData.filter(f => this.idsModel.includes(f.Id));

      this.modal.create({
        title: 'Cập nhật trạng thái giao hàng',
        size: 'xl',
        content: ModalManualUpdateDeliveryComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          model: datas
        }
      });
    }
  }

  updateDeliveryFromExcel() {
    this.modal.create({
      title: 'Cập nhật trạng thái giao hàng từ file',
      size: 'xl',
      content: ModalUpdateDeliveryFromExcelComponent,
      viewContainerRef: this.viewContainerRef
    });
  }

  showHistoryDS() {
    this.router.navigateByUrl('bill/historyds/list');
  }

  checkValueEmpty() {
    let ids: any[] = [...this.setOfCheckedId][0];
    this.idsModel = [...ids];

    if (this.idsModel.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }

    return 1;
  }

  sendPaymentRequest(): any {
    if (this.checkValueEmpty() == 1) {
      let state = 1;
      let dataPayment: any[] = [];
      let params = { ...this.params };

      for (let i = 0; i < this.idsModel.length; i++) {

        var exits = this.lstOfData.filter((a: any) => a.Id == this.idsModel[i])[0];
        if (exits && exits.State != 'open') {
          state = 0;
          return this.message.error('Chỉ gửi yêu cầu thanh toán với PBH có trạng thái đã xác nhận.');
        }

        if (exits && exits.State == 'open') {
          let item = {
            Id: exits.Id,
            Number: exits.Number,
            PartnerDisplayName: exits.PartnerDisplayName,
            PaymentMethod: 'ZaloPay',
            AmountTotal: exits.AmountTotal as number,
            PartnerId: exits.PartnerId,
            TeamId: parseInt(params.teamId),
            DateCreated: exits.DateCreated as Date
          }

          dataPayment.push(item);
        }
      }

      if (state == 1) {
        this.modal.create({
          title: 'Yêu cầu thanh toán',
          content: PaymentRequestComponent,
          size: 'xl',
          bodyStyle: {
            'padding': '0'
          },
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            dataPayment: dataPayment
          }
        });
      }
    }
  }

  cancelDelivery() {
    let that = this;
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      that.isProcessing = true;
      this.modal.warning({
        title: 'Hủy vận đơn',
        content: 'Bạn có muốn hủy vận đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelShipIds({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                that.message.success('Hủy vận đơn thành công!');
                that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
            },
            error: (error: any) => {
                this.isProcessing = false;
                that.message.error(`${error?.error?.message}`);
            }
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  cancelInvoice() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      this.modal.success({
        title: 'Hủy hóa đơn',
        content: 'Bạn có muốn hủy hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelInvoice({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                that.message.success('Hủy hóa đơn thành công!');
                that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
            },
            error: (error: any) => {
                this.isProcessing = false;
                that.message.error(`${error?.error?.message}`);
            }
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  unLink() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.modal.success({
        title: 'Xóa hóa đơn',
        content: 'Bạn có muốn xóa hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.unLink({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                that.message.success('Xóa hóa đơn thành công!');
                that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
            },
            error: (error: any) => {
                this.isProcessing = false;
                that.message.error(`${error?.error?.message}`);
            }
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  sendDelivery() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      this.modal.create({
        title: 'Danh sách phù hợp gửi lại mã vận đơn',
        content: SendDeliveryComponent,
        size: 'xl',
        bodyStyle: {
          'padding': '0'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: this.idsModel
        }
      });
    }
  }

  approveOrder() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;

      this.modal.success({
        title: 'Xác nhận bán hàng',
        content: 'Bạn có muốn xác nhận bán hàng',
        onOk: () => {
          that.fastSaleOrderService.actionInvoiceOpen({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: TDSSafeAny) => {
                that.isProcessing = false;

                if (res && TDSHelperString.hasValueString(res.Error) && res.Errors && !TDSHelperArray.hasListValue(res.Errors)) {
                  that.notification.error('Thông báo', res.Error);
                }

                if (res.Success) {
                  that.notification.success('Thông báo', 'Xác nhận bán hàng thành công!');
                }

                that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
            },
            error: (err: any) => {
                that.isProcessing = false;
                that.message.error(`${err?.error?.message}` || 'Xác nhận bán hàng thất bại');
            }
          })
        },
        onCancel: () => { that.isProcessing = false },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  registerPaymentMulti(): any {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      this.fastSaleOrderService.getRegisterPaymentMulti({ ids: this.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if (res && TDSHelperArray.isArray(res.value)) {
              this.modal.create({
                title: 'Xác nhận thanh toán',
                content: PaymentMultipComponent,
                size: 'lg',
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                    lstCustomer: res.value
                }
              });
            }
        },
        error: (error: any) => {
          this.message.error(`${error.error.message}`);
        }
      })
    }
  }

  registerPayment(): any {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      this.fastSaleOrderService.getRegisterPayment({ ids: this.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(!res) return;
            delete res['@odata.context'];

            this.modal.create({
                title: 'Đăng ký thanh toán',
                size: 'lg',
                content: ModalPaymentComponent,
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                  dataModel: res
                }
            });
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
        }
      })
    }
  }

  actionBatchRefund(): any {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let idsSelect: any = [];

      this.idsModel.map((x: any) => {
        let exits = this.lstOfData.filter((a: any) => a.Id == x)[0];
        if (exits && exits.State == 'open' || exits.State == 'paid') {
          idsSelect.push(x);
        }
      });

      if (!TDSHelperArray.hasListValue(idsSelect)) {
        return this.message.error('Chỉ gửi yêu cầu thanh toán với PBH có trạng thái đã xác nhận hoặc đã thanh toán');
      }

      this.modal.create({
        title: 'Trả hàng hàng loạt',
        size: 'lg',
        content: ModalBatchRefundComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: idsSelect
        }
      });
    }
  }

}
