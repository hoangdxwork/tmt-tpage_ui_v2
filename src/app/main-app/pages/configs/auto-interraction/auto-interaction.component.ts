import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { AutoInteractionDTO, GeneralConfigUpdateDTO, ShippingStatuesDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'auto-interaction',
  templateUrl: './auto-interaction.component.html'
})

export class AutoInteractionComponent implements OnInit, OnDestroy {

  _form!: FormGroup;

  isLoading: boolean = false;
  lstShippingStatues: ShippingStatuesDTO[] = [];
  private destroy$ = new Subject<void>();

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
      OrderTemplate: [`${this.areaText1}`],
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
    this.loadShippingStatus();
    this.loadData();
  }

  loadShippingStatus() {
    this.generalConfigService.getShippingStatues().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstShippingStatues = res;
    });
  }

  loadData() {
    let name = "AutoInteraction";
    this.isLoading  = true;

    this.generalConfigService.getByName(name)
      .pipe(finalize(() => this.isLoading = false))
      .pipe(takeUntil(this.destroy$)).subscribe((res: AutoInteractionDTO) => {
        if (res.ShippingTemplate) {
          res.ShippingTemplate = res.ShippingTemplate.replace(/\\n/, "<p><br></p>")
        }
        if (res.BillTemplate) {
          res.BillTemplate = res.BillTemplate.replace(/\\n/, "<p><br></p>")
        }
        if (res.OrderTemplate) {
          res.OrderTemplate = res.OrderTemplate.replace(/\\n/, "<p><br></p>")
        }
        this.updateForm(res);
    })
  }

  onSave(){
    let model = this.prepareModel();
    this.generalConfigService.update(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.message.success('Thao tác thành công');
    }, error =>{
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  prepareModel(): GeneralConfigUpdateDTO<AutoInteractionDTO> {
    const formModel = this._form.value;

    let value: AutoInteractionDTO = {
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
    };

    let model: GeneralConfigUpdateDTO<AutoInteractionDTO> = {
      Name: 'AutoInteraction',
      Value: value
    };

    return model;
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}
