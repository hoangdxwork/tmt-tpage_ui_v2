import { AccountPaymentJsonService } from 'src/app/main-app/services/account-payment-json.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';
import { BillDetailDTO } from 'src/app/main-app/dto/bill/bill-detail.dto';
import { PaymentJsonDTO } from 'src/app/main-app/dto/bill/payment-json.dto';
import { TDSModalService } from 'tds-ui/modal';
import { TDSStatusType } from 'tds-ui/step';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { PaymentJsonBillComponent } from '../components/payment-json/payment-json-bill.component';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html',
  providers: [TDSDestroyService]
})

export class DetailBillComponent implements OnInit{

  id: any;
  dataModel!: BillDetailDTO;
  isLoading: boolean = false;
  payments: Array<PaymentJsonDTO> = [];

  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;

  indexStep: number = 1;
  indx: number = -1;
  isProcessing: boolean = false;

  statusStringBill: string = 'Nháp';
  isCancelPayment: boolean = false;
  isPaymentDone: boolean = false;
  isStatusStep: TDSStatusType = 'process';
  isButtonComfirm: boolean = false;
  teamId!:TDSSafeAny;

  modalImages: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private notificationService: TDSNotificationService,
    private cRMTeamService: CRMTeamService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private accountPaymentJsonService: AccountPaymentJsonService,
    private modalService: TDSModalService,
    private printerService: PrinterService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadData();
  }

  directPage(route:string){
    this.router.navigateByUrl(route);
  }

  loadData(): void {
    this.loadPaymentInfoJson();
    this.loadBill();
  }

  loadBill() {
    this.productUOMQtyTotal= 0;
    this.productPriceTotal = 0;

    this.isLoading = true;
    this.fastSaleOrderService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
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

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      })
  }

  loadTeamById(id: any) {
    this.cRMTeamService.getTeamById(id).subscribe({
      next:(team: any) => {
        if(team) {
          this.dataModel.Team.Name = team.Name;
          this.dataModel.Team.Facebook_PageName = team.Facebook_PageName;
          this.dataModel.Team.Facebook_UserName = team.Facebook_UserName;
        }
      }
    })
  }

  loadPaymentInfoJson() {
    this.fastSaleOrderService.getPaymentInfoJson(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.payments = [...res.value];
        this.cdr.detectChanges();
      },
      error:(error) => {
        this.message.error(error?.error?.message || 'Lỗi tải thông tin thanh toán');
      }
    })
  }


  showPaymentInfo(i: number){
    this.indx = i;
  }

  print(type: string) {
    let that = this;
    if (this.isProcessing) {
      return
    }

    let obs!: Observable<any>;
    switch (type) {
      case "bill80":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(this.dataModel.Id)]}&Template=bill80`);
        break;
      case "bill58":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(this.dataModel.Id)]}&Template=bill58`);
        break;
      case "A5":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(this.dataModel.Id)]}&Template=A5`);
        break;
      case "A4":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(this.dataModel.Id)]}&Template=A4`);
        break;
      case "delivery":
        obs = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${[Number(this.dataModel.Id)]}`);
        break;
      case "ship":
        let url = `/fastsaleorder/PrintShipThuan?ids=${[Number(this.dataModel.Id)]}`;
        if (Number(this.dataModel.CarrierId) > 0) {
          url = `${url}&carrierid=${this.dataModel.CarrierId}`;
        }
        obs = this.printerService.printUrl(url);
        break;
      default:
        break;
    }

    if (obs) {
      this.isProcessing = true;
      obs.pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: TDSSafeAny) => {
            that.printerService.printHtml(res);
            that.isProcessing = false;
        },
        error:(err: any) => {
          this.isProcessing = false;
        }
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
          this.isLoading = true;

          that.fastSaleOrderService.getSendToShipper(model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {
              this.isLoading = true;
              that.isProcessing = false;
              that.message.success('Xác nhận gửi vận đơn thành công!');
              that.loadData();
            },
            error:(error) => {
              that.isProcessing = false;
              this.isLoading = false;
              this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
            }
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  actionCancel() {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.warning({
      title: 'Hủy hóa đơn',
      content: 'Bạn có muốn xác nhận hủy hóa đơn',
      onOk: () => {
          let model = {
              ids: [parseInt(that.id)]
          }

          that.fastSaleOrderService.getActionCancel(model).pipe(takeUntil(this.destroy$)).subscribe({
            next:() => {
              that.message.success('Xác nhận hủy hóa đơn thành công!');
              that.isProcessing = false;

              this.loadData();
            },
            error:(error) => {
                that.isProcessing = false;
                that.message.error(error?.error?.message || 'Xác nhận hủy hóa đơn thất bại');
            }
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  paymentInfoJson() {
    this.accountPaymentJsonService.defaultGetFastSaleOrder({ orderId: this.dataModel.Id }).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        if(res) {
          delete res['@odata.context'];

          if(res.PaymentDate) {
            res.PaymentDate = new Date(res.PaymentDate);
          }

          const modal = this.modalService.create({
            title: 'Đăng ký thanh toán',
            content: PaymentJsonBillComponent,
            size: "lg",
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              data: res
            }
          });

          modal.afterClose.subscribe({
            next:(res) => {
              if(res){
                this.loadData();
              }
            }
          })
        }
      },
      error:(error) => {
        this.message.error(error?.error?.message || 'Thanh toán bị lỗi');
      }
    })
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

          that.fastSaleOrderService.getActionRefund(model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {
              that.message.success('Tạo trả hàng thành công!');
              that.isProcessing = false;

              this.loadData();
            },
            error:(error) => {
                that.isProcessing = false;
                that.message.error(error?.error?.message || 'Tạo trả hàng thất bại');
            }
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

        that.fastSaleOrderService.actionInvoiceOpen(model).pipe(takeUntil(this.destroy$)).subscribe({
          next:(res: any) => {

            if(res) {
                if(res && TDSHelperString.hasValueString(res.Error) && res.Errors && !TDSHelperArray.hasListValue(res.Errors)){
                  that.notificationService.error('Thông báo', res.Error);
                } else {
                  // danh sách lỗi
                }

                if(res.Success){
                  that.notificationService.success('Thông báo', 'Xác nhận bán hàng thành công!');
                }

                let obs!: Observable<any>;

                switch (type) {
                  case "print":
                    obs = that.printerService.printUrl(`/fastsaleorder/print?ids=${[parseInt(that.id)]}`);
                    break;

                  case "printShip":
                    let url = `/fastsaleorder/PrintShipThuan?ids=${[Number(that.id)]}`;
                    if (Number(this.dataModel.CarrierId) > 0) {
                      url = `${url}&carrierid=${this.dataModel.CarrierId}`;
                    }
                    obs = this.printerService.printUrl(url);
                    break;
                  default: break;
                }

                if (obs) {
                  obs.pipe(takeUntil(that.destroy$)).subscribe({
                      next:(res: TDSSafeAny) => {
                          that.printerService.printHtml(res);
                      },
                  })
                }

                this.loadData();
                this.loadInventoryIds();
            }

            that.isProcessing = false;
            this.isLoading = false;
          },
          error:(error) => {
              this.isProcessing = false;
              this.isLoading = false;
              that.message.error(error?.error?.message || 'Xác nhận bán hàng thất bại');
          }
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
    this.commonService.getInventoryByIds(warehouseId, ids).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.notificationService.success('Tồn kho', 'Cập nhật tồn kho thành công!');
      },
      error:(error) => {
        this.notificationService.warning('Tồn kho', 'Cập nhật tồn kho thất bại!');
      }
    })
  }

  copyInvoice() {
    let key = this.fastSaleOrderService._keyCacheCopyInvoice;
    localStorage.setItem(key, JSON.stringify(this.dataModel));
    this.onCopy();
  }

  onCreate(){
    this.router.navigateByUrl('bill/create');
  }

  onEdit(){
    this.router.navigateByUrl(`bill/edit/${this.id}`);
  }

  onCopy(){
    this.router.navigateByUrl(`bill/copy/${this.id}`);
  }

  onOpenTrackingUrl(data: BillDetailDTO) {
    if(data && TDSHelperString.hasValueString(data.TrackingUrl)) {
      window.open(data.TrackingUrl, '_blank')
    }
  }

  openImages() {
    this.modalImages = true;
  }

  handleCancel(): void {
    this.modalImages = false;
  }

  onBack(){
    history.back();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEventCreate(event: KeyboardEvent) {
    if (event.key === 'F9') {
      this.onSavePrint('print');
    } else if (event.key === 'F8') {
      this.onSavePrint('confirm');
    }
  }
}
