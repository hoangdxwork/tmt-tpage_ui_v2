import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { AutoInteractionDTO, ShippingStatuesDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ConfigSaleOrderDTO } from 'src/app/main-app/dto/configs/sale-order/config-sale-order.dto';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'sale-order',
  templateUrl: './sale-order.component.html'
})

export class SaleOrderComponent implements OnInit, OnDestroy {

  _form!: FormGroup;

  isLoading: boolean = false;
  lstShippingStatus: ShippingStatuesDTO[] = [];
  private destroy$ = new Subject<void>();

  init = {
    document_base_url: "https://test.tpos.dev"
  }

  tagHelpers = [
    { id: "Bài live", value: "{order.live_title}" },
    { id: "Tên KH", value: "{partner.name}" },
    { id: "Mã KH", value: "{partner.code}" },
    { id: "Điện thoại KH", value: "{partner.phone}" },
    { id: "Địa chỉ KH", value: "{partner.address}" },
    { id: "Đơn hàng", value: "{order}" },
    { id: "Mã đơn hàng", value: "{order.code}" },
    { id: "Chi tiết đơn hàng", value: "{order.details}" },
    { id: "Tổng tiền đơn hàng", value: "{order.total_amount}" },
    { id: "Bình luận chốt đơn", value: "{order.comment}" },
    { id: "Sản phẩm chốt đơn", value: "{order.product}" },
    { id: "Mã hoá đơn", value: "{bill.code}" },
    { id: "Chi tiết hoá đơn", value: "{bill.details}" },
    { id: "Sản phẩm hóa đơn", value: "{bill.product}" },
    { id: "Mã vận đơn", value: "{shipping.code}" },
    { id: "Tiền thu hộ", value: "{shipping.cod}" },
    { id: "Thông tin giao hàng", value: "{shipping.info}" },
    { id: "Trạng thái giao hàng", value: "{shipping.status}" },
    { id: "Chi tiết giao hàng", value: "{shipping.details}" },
    { id: "Ghi chú giao hàng", value: "{shipping.note}" },
    { id: "Tên Facebook KH", value: "{facebook.name}" },
    { id: "Hiển thị giảm giá", value: "{bill.discount}" },
    { id: "Ghi chú hóa đơn", value: "{bill.note}" },
  ];

  areaText1 = 'Xin chào {partner.name}, bạn đã đặt hàng trên live {order.live_title} thành công.\n{order.comment}\n{order.product}\nTổng tiền trong đơn: {order.total_amount}';
  areaText2 = 'Xin chào {partner.name}, hoá đơn có mã {bill.code} đã được tạo.\n{bill.details}\n{bill.note}\n{shipping.details}';
  areaText3 = 'Xin chào {partner.name}, hoá đơn có mã {bill.code} đã được cập nhật trạng thái giao hàng.\n{shipping.details}';

  constructor(private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private generalConfigService: GeneralConfigService,
    private message: TDSMessageService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      IsEnableOrder: [false],
      IsEnableShopLink: [false],
      IsEnableShipping: [false],
      IsEnableBill: [false],
      IsUsingProviderTemplate: [false],
      IsOrderAutoReplyOnlyOnce:[false],
      OrderTemplate: new FormControl(`${this.areaText1}`, [Validators.required]),
      ShopLabel: [null],
      ShopLabel2: [null],
      BillTemplate: [`${this.areaText2}`],
      ShippingTemplate: [`${this.areaText3}`],
      ShippingStatues: [null]
    })
  }

  updateForm(data: AutoInteractionDTO) {
    this._form.patchValue(data);
  }

  ngOnInit(): void {
    this.loadData();
    this.loadShippingStatus();
  }

  loadShippingStatus() {
    this.generalConfigService.getShippingStatues().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.lstShippingStatus = res;
      },
      error:(err)=>{
        this.message.error(err?.error?.message)
      }
    });
  }

  loadData() {
    let name = "AutoInteraction";
    this.isLoading  = true;

    this.generalConfigService.getByName(name).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: ConfigSaleOrderDTO) => {
          this.updateForm(res);
          this.isLoading = false;
        },
        error:(err) => {
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          this.isLoading = false;
        }
      })
  }

  changeIsEnableOrder(event: any) {
    if(event == false) {
        this._form.controls['IsEnableShopLink'].setValue(false)
    }
  }

  changeIsEnableBill(event: any) {
    if(event == false) {
      this._form.controls['IsUsingProviderTemplate'].setValue(false)
  }
  }

  onSave() {
    let name = "AutoInteraction";
    let model = this.prepareModel();
    this.isLoading = true;

    this.generalConfigService.update(name, model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
        this.message.success('Thao tác thành công');
    }, error =>{
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  prepareModel() {
    let formModel = this._form.value;

    let model: any = {
      IsEnableShipping: formModel["IsEnableShipping"],
      ShippingStatues: formModel["ShippingStatues"] as string[],
      ShippingTemplate: formModel["ShippingTemplate"],
      IsEnableOrder: formModel["IsEnableOrder"],
      OrderTemplate: formModel["OrderTemplate"],
      IsOrderReplyOnlyOnce: formModel["IsOrderReplyOnlyOnce"],
      IsEnableShopLink: formModel["IsEnableShopLink"],
      ShopLabel: formModel["ShopLabel"],
      ShopLabel2: formModel["ShopLabel2"],
      IsEnableBill: formModel["IsEnableBill"],
      IsUsingProviderTemplate: formModel["IsUsingProviderTemplate"],
      BillTemplate: formModel["BillTemplate"]
    } as ConfigSaleOrderDTO

    return model;
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
