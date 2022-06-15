import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { AutoInteractionDTO, GeneralConfigUpdateDTO, ShippingStatuesDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'auto-interaction',
  templateUrl: './auto-interaction.component.html'
})

export class AutoInteractionComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  lstShippingStatues: ShippingStatuesDTO[] = [];
  private destroy$ = new Subject<void>();

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
    this.generalConfigService.getByName(name).pipe(takeUntil(this.destroy$)).subscribe((res: AutoInteractionDTO) => {
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
      this.message.success(Message.SaveSuccess);
    }, error =>{
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  prepareModel(): GeneralConfigUpdateDTO<AutoInteractionDTO> {
    const formValue = this._form.value;

    let value: AutoInteractionDTO = {
      IsEnableShipping: formValue["IsEnableShipping"],
      ShippingStatues: formValue["ShippingStatues"] as string[],
      ShippingTemplate: formValue["ShippingTemplate"],
      IsEnableOrder: formValue["IsEnableOrder"],
      OrderTemplate: formValue["OrderTemplate"],
      IsOrderReplyOnlyOnce: formValue["IsOrderReplyOnlyOnce"],
      IsEnableShopLink: formValue["IsEnableShopLink"],
      ShopLabel: formValue["ShopLabel"],
      ShopLabel2: formValue["ShopLabel2"],
      IsEnableBill: formValue["IsEnableBill"],
      IsUsingProviderTemplate: formValue["IsUsingProviderTemplate"],
      BillTemplate: formValue["BillTemplate"]
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
