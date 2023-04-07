import { BillDetailDTO } from 'src/app/main-app/dto/bill/bill-detail.dto';
import { PaymentJsonDTO } from 'src/app/main-app/dto/bill/payment-json.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { THelperCacheService } from 'src/app/lib';
import { Router } from '@angular/router';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { finalize, Observable, takeUntil } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { Conversation_LastBillDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';

@Component({
  selector: 'drawer-detail-bill',
  templateUrl: './drawer-detail-bill.component.html',
  providers: [ TDSDestroyService ]
})
export class DrawerDetailBillComponent implements OnInit, OnChanges {

  @Input() bill!: Conversation_LastBillDto;
  @Input() isBillNearest!: boolean;
  @Input() isMessage: boolean = false;
  @Input() visibleDrawerBillDetail: boolean = false;

  @Output() onVisibleDrawer = new EventEmitter<boolean>();

  payments: Array<PaymentJsonDTO> = [];
  selectedIndex: number = 0;

  id!: any;

  isLoading: boolean = false;
  isProcessing: boolean = false;
  popoverVisible: boolean = false;

  dataModel!: BillDetailDTO;
  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;
  indexStep: number = 1;

  constructor(private cdRef: ChangeDetectorRef,
    private fastSaleOrderService: FastSaleOrderService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private cRMTeamService: CRMTeamService,
    private printerService: PrinterService,
    private modalService: TDSModalService,
    private cacheApi: THelperCacheService,
    private router: Router) { }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes["bill"] && !changes["bill"].firstChange){
      this.bill = changes["bill"].currentValue;
    }
    if(changes["visibleDrawerBillDetail"] && !changes["visibleDrawerBillDetail"].firstChange && changes["visibleDrawerBillDetail"].currentValue){
      this.onDrawerDetailBill();
    }
  }

  ngOnInit(): void {
  }

  onDrawerDetailBill(event?: TDSSafeAny){
    if(event){
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    this.visibleDrawerBillDetail = true;
    this.id = this.bill.Id;
    this.loadData();
  }

  validateData(){
    this.dataModel = {} as TDSSafeAny;
    this.productUOMQtyTotal = 0;
    this.productPriceTotal = 0;
    this.indexStep = 1;
  }

  loadData(): void {
    this.validateData();
    this.loadBill();
    this.loadPaymentInfoJson();
  }

  loadBill() {
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
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        this.cdRef.detectChanges();
      }
    })
  }

  loadPaymentInfoJson() {
    this.fastSaleOrderService.getPaymentInfoJson(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        (res: any) => {
          this.payments = [...res.value];
        }
      }
    })
  }

  loadTeamById(id: any) {
    this.cRMTeamService.getTeamById(id).subscribe({
      next: (team: any) => {
          if(team) {
            this.dataModel.Team!.Name = team.Name;
            this.dataModel.Team!.Facebook_PageName = team.Facebook_PageName;
          }
      }
    })
  }

  onClickButton(e: MouseEvent) {
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
            next: (res: any) => {
                this.isLoading = false;
                that.isProcessing = false;
                that.message.success('Xác nhận gửi vận đơn thành công!');
                that.loadData();
            },
            error: (error: any) => {
              this.isLoading = false;
              that.isProcessing = false
              this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
            }
          })
      },
      onCancel: () => { that.isProcessing = false; this.cdRef.detectChanges(); },
      okText: "Xác nhận",
      cancelText: "Đóng",
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
      onCancel: () => { that.isProcessing = false; this.cdRef.detectChanges();},
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  copyInvoice() {
    let key = this.fastSaleOrderService._keyCacheCopyInvoice;
    localStorage.setItem(key, JSON.stringify(this.dataModel));
    this.onCopy();
  }

  onCopy(){
    this.router.navigateByUrl(`bill/copy/${this.id}`);
  }

  onEdit(){
    this.router.navigateByUrl(`bill/edit/${this.id}`);
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

          that.fastSaleOrderService.getActionCancel(model).pipe(takeUntil(this.destroy$), finalize(() => that.isProcessing = false)).subscribe(() => {
              that.message.success('Xác nhận hủy hóa đơn thành công!');
              this.loadData();
          }, error => {
              that.message.error(error.error.message ?? 'Xác nhận hủy hóa đơn thất bại');
          })
      },
      onCancel: () => { that.isProcessing = false; this.cdRef.detectChanges(); },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
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

    this.isProcessing = true;
    obs?.pipe(takeUntil(that.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
          that.printerService.printHtml(res);
          that.isProcessing = false;
      },
      error: (error: any) => {
        let err: any;

        if(typeof(error) === "string") {
          err = JSON.parse(error) as any;
        } else {
          err = error;
        }

        this.isProcessing = false;
        this.message.error(error?.error?.message);
      }
    })
  }

  onClose(){
    this.visibleDrawerBillDetail = false;
    this.onVisibleDrawer.emit(false);
  }

  onOpenTrackingUrl(data: BillDetailDTO) {
    if(data && TDSHelperString.hasValueString(data.TrackingUrl)) {
      window.open(data.TrackingUrl, '_blank')
    }
  }
}
