import { ModalPaymentComponent } from './../../partner/components/modal-payment/modal-payment.component';
import { Component, OnDestroy, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/main-app/services/common.service';
import { BillDetailDTO } from 'src/app/main-app/dto/bill/bill-detail.dto';
import { PaymentJsonDTO } from 'src/app/main-app/dto/bill/payment-json.dto';
import { TDSModalService } from 'tds-ui/modal';
import { TDSStatusType } from 'tds-ui/step';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { THelperCacheService } from 'src/app/lib';
import { PaymentJsonBillComponent } from '../components/payment-json/payment-json-bill.component';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html'
})

export class DetailBillComponent implements OnInit, OnDestroy{

  id: any;
  dataModel!: BillDetailDTO;
  isLoading: boolean = false;
  payments: Array<PaymentJsonDTO> = [];

  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;

  indexStep: number = 1;
  popoverVisible: boolean = false;
  isProcessing: boolean = false;

  private destroy$ = new Subject<void>();

  statusStringBill: string = 'Nháp';
  isCancelPayment: boolean = false;
  isPaymentDone: boolean = false;
  isStatusStep: TDSStatusType = 'process';
  isButtonComfirm: boolean = false;
  teamId!:TDSSafeAny;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private cacheApi: THelperCacheService,
    private cRMTeamService: CRMTeamService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private modalService: TDSModalService,
    private printerService: PrinterService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadData();
  }

  directPage(route:string){
    this.router.navigateByUrl(route);
  }

  loadData(): void {
    this.loadBill();
    this.loadPaymentInfoJson();
  }

  loadBill() {
    this.isLoading = true;
    this.fastSaleOrderService.getById(this.id).pipe(takeUntil(this.destroy$),finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        delete res['@odata.context'];

        if (res.DateCreated) {
          res.DateCreated = new Date(res.DateCreated);
        }
        if (res.DateInvoice) {
          res.DateInvoice = new Date(res.DateInvoice);
        }
        if (res.DateOrderRed) {
          res.DateOrderRed = new Date(res.DateOrderRed);
        }
        if (res.ReceiverDate) {
          res.ReceiverDate = new Date(res.ReceiverDate);
        }

        this.dataModel = res;
        // console.log(this.dataModel)

        for (var item of this.dataModel.OrderLines) {
          this.productUOMQtyTotal = this.productUOMQtyTotal + item.ProductUOMQty;
          this.productPriceTotal = this.productPriceTotal + item.PriceTotal;
        }

        switch(res.State) {
          case 'draft':
              this.indexStep = 1;
              break;
          case 'open':
             this.indexStep = 2;
             break;
          case 'paid':
               this.indexStep = 3;
              break;
          case 'cancel':
            this.indexStep = 4;
            break;
        }

        //TODO: nếu Team thiếu thông tin thì map dữ liệu
        if(res.TeamId) {
          this.loadTeamById(res.TeamId);
        }
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi')
    })
  }

  loadTeamById(id: any) {
    this.cRMTeamService.getTeamById(id).subscribe((team: any) => {
        this.dataModel.Team.Name = team.Name;
        this.dataModel.Team.Facebook_PageName = team.Facebook_PageName;
    })
  }

  loadPaymentInfoJson() {
    this.fastSaleOrderService.getPaymentInfoJson(this.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.payments = [...res.value];
    }, error => {
      this.message.error('Load thông tin thanh toán đã lỗi!');
    })
  }

  getShowState(type: string): any {
    switch (type) {
      case 'draf':
        return 'Nháp';
      case 'cancel':
        return 'Hủy bỏ';
      case 'open':
        return 'Xác nhận';
      case 'paid':
        return 'Đã thanh toán';
    }
  }

  print(type: string) {
    let that = this;
    if (this.isProcessing) {
      return
    }

    let obs: TDSSafeAny;
    switch (type) {
      case "bill80":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=bill80`);
        break;
      case "bill58":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=bill58`);
        break;
      case "A5":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=A5`);
        break;
      case "A4":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=A4`);
        break;
      case "delivery":
        obs = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.dataModel.Id}`);
        break;
      case "ship":
        let carrierId = "";
        if (this.dataModel.CarrierId) {
          carrierId = `&CarrierId=${this.dataModel.CarrierId}`;
        }
        obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.dataModel.Id}${carrierId}`);
        break;
      default:
        break;
    }
    if (TDSHelperObject.hasValue(obs)) {
      this.isProcessing = true;
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          that.printerService.printHtml(res);
          that.isProcessing = false;
      })
    }
  }

  sendToShipper() {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Gửi vận đơn',
      content: 'Bạn có muốn gửi vận đơn',
      onOk: () => {
          let model = { id: parseInt(that.id) }

          that.fastSaleOrderService.getSendToShipper(model).pipe(takeUntil(this.destroy$), finalize(() => that.isProcessing = false)).subscribe((res: TDSSafeAny) => {
              that.message.success('Xác nhận gửi vận đơn thành công!');
              that.loadData();
          }, error => {
            let err = error.error.message.split('Error:')?.[1];
            that.message.error(err ?? 'Gửi vận đơn thất bại');
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  actionCancel() {
    console.log(this.isProcessing)
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Hủy hóa đơn',
      content: 'Bạn có muốn xác nhận hủy hóa đơn',
      onOk: () => {
          let model = {
              ids: [parseInt(that.id)]
          }

          that.fastSaleOrderService.getActionCancel(model).pipe(takeUntil(this.destroy$), finalize(() => that.isProcessing = false)).subscribe(() => {
              that.message.success('Xác nhận hủy hóa đơn thành công!');
              this.loadData();
          }, error => {
              that.message.error(error.error.message ?? 'Xác nhận hủy hóa đơn thất bại');
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  onClickButton(e: MouseEvent) {
  }

  paymentInfoJson() {
    this.modalService.create({
      title: 'Đăng ký thanh toán',
      content: PaymentJsonBillComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: this.dataModel.Id
      }
    });
  }

  cancelBill() {
    this.modalService.error({
      title: 'Xác nhận hủy',
      content: 'Bạn có muốn hủy hóa đơn, thông tin về đơn hàng này sẽ được xóa',
      onOk: () => {
        this.isStatusStep = 'error'
      },
      onCancel: () => { console.log('cancel') },
      okText: "Hủy hóa đơn",
      cancelText: "Đóng"
    });
  }

  actionRefund() {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Tạo trả hàng',
      content: 'Bạn có muốn xác nhận tạo trả hàng',
      onOk: () => {
          let model = { id: parseInt(that.id) };

          that.fastSaleOrderService.getActionRefund(model).pipe(takeUntil(this.destroy$), finalize(() => that.isProcessing = false)).subscribe((res: TDSSafeAny) => {
              that.message.success('Tạo trả hàng thành công!');
              this.loadData();
          }, error => {
              that.message.error(error.error.message ?? 'Tạo trả hàng thất bại');
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  onSavePrint(type: string) {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    that.modalService.success({
      title: 'Xác nhận bán hàng',
      content: 'Bạn có muốn xác nhận bán hàng',
      onOk: () => {
        let model = { ids: [parseInt(that.id)] };
        this.isLoading = true;
        that.fastSaleOrderService.actionInvoiceOpen(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if(res && res.Success) {

              that.message.success('Xác nhận bán hàng thành công!');

              let obs: TDSSafeAny;
              switch (type) {
                case "print":
                  obs = that.printerService.printUrl(`/fastsaleorder/print?ids=${that.id}`);
                  break;

                case "printship":
                  if(this.dataModel.Carrier) {
                    obs = that.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=` + `${that.id}` + "&carrierid=" + `${that.dataModel.Carrier.Id}`);
                  } else {
                    obs = that.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${that.id}`);
                  }
                  break;
                default: break;
              }

              if (TDSHelperObject.hasValue(obs)) {
                obs.pipe(takeUntil(that.destroy$)).subscribe((res: TDSSafeAny) => {
                  that.printerService.printHtml(res);
                  that.isProcessing = false;
                  this.isLoading = false;
                })
              }else{
                this.isProcessing = false;
                this.isLoading = false;
              }
              this.loadData();
              this.loadInventoryIds();
          }
        }, error => {
            this.isProcessing = false;
            this.isLoading = false;
            that.message.error(`${error.error.message || 'Xác nhận bán hàng thất bại'}`);
        })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  loadInventoryIds(){
    let ids: any = [];
    let data = this.dataModel.OrderLines;
    if(data) {
      data.forEach((x: any) => {
        if (!ids.includes(x.ProductId)) {
            ids.push(x.ProductId);
        }
      });
    }

    let warehouseId = this.dataModel.WarehouseId;
    this.commonService.getInventoryByIds(warehouseId, ids).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success('Cập nhật tồn kho thành công!');
    }, error => {
      this.message.error(`${error.error.message || 'Cập nhật tồn kho thất bại'}`);
    })
  }

  copyInvoice() {
    let model = this.dataModel;

    model.TrackingRef = "";
    model.TrackingRefSort = "";
    model.State = 'draft';
    model.ShipStatus = 'none';
    model.ShipPaymentStatus = '';
    model.DateInvoice = new Date();
    model.Comment = "";

    //Truong hop nhieu cong ty copy tu cong ty khac
    delete model["Id"];
    delete model["Number"];
    delete model["Warehouse"];
    delete model["WarehouseId"];
    delete model["PaymentJournal"];
    delete model["PaymentJournalId"];
    delete model["Account"];
    delete model["AccountId"];
    delete model["Company"];
    delete model["CompanyId"];
    delete model["Journal"];
    delete model["JournalId"];
    delete model["PaymentInfo"];
    delete model["User"];
    delete model["UserId"];
    delete model["UserName"];

    model.OrderLines.map((item) => {
      delete item["Account"];
      delete item["AccountId"];
    });

    let keyCache = this.fastSaleOrderService._keyCacheCopyInvoice as string;
    this.cacheApi.setItem(keyCache, JSON.stringify(model));
    this.onCreate();
  }

  onCreate(){
    this.router.navigateByUrl('bill/create');
  }

  onEdit(){
    this.router.navigateByUrl(`bill/edit/${this.id}`);
  }

  onBack(){
    history.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
