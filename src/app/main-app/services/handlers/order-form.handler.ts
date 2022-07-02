import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { FastSaleOrderService } from '../fast-sale-order.service';
import { map } from 'rxjs/operators';
import { GeneralConfigsFacade } from '../facades/general-config.facade';
import { TAuthService } from 'src/app/lib';
import { SaleSettingsDTO } from '../../dto/setting/setting-sale-online.dto';
import { DataCheckInfoPartnerDTO } from '../../dto/partner/partner.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { FastSaleOrderRestDTO } from '../../dto/saleonlineorder/saleonline-order-red.dto';

@Injectable()
export class OrderFormHandler {

  saleSetting!: SaleSettingsDTO;
  companyId: TDSSafeAny;
  billDefault$!: Observable<FastSaleOrderRestDTO>;

  readonly patternPhone = /(?:\b|[^0-9])((0|o|84|\+84)(\s?)([2-9]|1[0-9])(\d|o(\s|\.)?){8})(?:\b|[^0-9])/;

  constructor(
    private formBuilder: FormBuilder,
    private auth: TAuthService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private fastSaleOrderService: FastSaleOrderService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleSetting = res?.SaleSetting;
    });

    this.auth.getUserInit().subscribe(res => {
      this.companyId = res?.Company?.Id;
    });
  }

  createOrderFormGroup() {
    return this.formBuilder.group({
      Id: [null],

      Facebook_ASUserId: [null],
      Facebook_UserId: [null],
      Facebook_UserName: [null],
      Facebook_CommentId: [null],
      Facebook_Comments: [null],
      Facebook_PostId: [null],

      LiveCampaignId: [null],

      Name: [null],
      Code: [null],

      // StatusText: "",
      SessionIndex: [null],
      Session: [null],
      PrintCount: [null],

      PartnerId: null,
      PartnerName: [null],
      Telephone: [null],
      Email: [null],

      CRMTeamId: null,
      AmountUntaxed: [null],
      AmountTax: [null],
      TotalAmount: [null],
      TotalAmountBill: [null],
      TotalQuantity: [null],
      DecreaseAmount: [null],
      PaymentAmount: [null],
      DiscountAmount: [null],
      Discount: [null],
      Tax: [null],
      Note: [null],
      Details: this.formBuilder.array([]),

      Street: [null],
      City: [null],
      District: [null],
      Ward: [null],
      Carrier: [null],

      User: [null],

      tempPartner: this.formBuilder.group({ Address: '' })
    });
  }

  createBillDefault(): Observable<FastSaleOrderRestDTO> {
    if(this.billDefault$) return this.billDefault$;

    this.billDefault$ = new Observable(observer => {
      this.getBillInvoiceDefault().subscribe(res => {
        observer.next(res);
        observer.complete();
      });
    });

    return this.billDefault$;
  }

  private getBillInvoiceDefault(): Observable<FastSaleOrderRestDTO> {
    let typeInvoice = { "model": { "Type": "invoice" } };
    return this.fastSaleOrderService.getDefault(typeInvoice)
          .pipe(map((res) => {
            this.updateBillDefault(res);
            return res;
          }));
  }

  private updateBillDefault(billDefault: FastSaleOrderRestDTO) {
    let carrier = billDefault.Carrier;

    billDefault.CompanyId = this.companyId;

    if(carrier) {
      billDefault.DeliveryPrice = carrier.Config_DefaultFee || 0;
      billDefault.ShipWeight = carrier.Config_DefaultWeight;
      billDefault.Ship_Extras = carrier.ExtrasText && JSON.parse(carrier.ExtrasText);
    }
    else if(this.saleSetting) {
      billDefault.DeliveryPrice = this.saleSetting.ShipAmount || 0;
      billDefault.ShipWeight = this.saleSetting.Weight;
    }

    // Gán lại giá trị nếu empty
    billDefault.Ship_Extras = billDefault.Ship_Extras || {};
    billDefault.DeliveryPrice = billDefault.DeliveryPrice || 0;
    billDefault.ShipWeight = billDefault.ShipWeight || 100;

    billDefault.CashOnDelivery = billDefault.DeliveryPrice;
  }

  updateFormByComment(form: FormGroup, comment: any, partner?: DataCheckInfoPartnerDTO) {
    form.reset();
    let details = new FormArray([]);
    form.setControl("Details", details);
    form.controls.Facebook_UserName.setValue(comment?.from?.name);
    form.controls.Facebook_ASUserId.setValue(comment?.from?.id);
    form.controls.Facebook_CommentId.setValue(comment?.id);
    form.controls.Facebook_PostId.setValue(comment?.object?.id);
    form.controls.Name.setValue(comment?.from?.name);

    if(comment?.assigned_to) {
      form.controls.User.setValue(comment.assigned_to);
    }
    else {
      // Gán user mặc định
    }

    if(partner) {
      form.controls.PartnerName.setValue(partner.Name);
      form.controls.Telephone.setValue(partner.Phone);
      form.controls.Street.setValue(partner.Phone);
      form.controls.City.setValue(partner.City);
      form.controls.District.setValue(partner.District);
      form.controls.Ward.setValue(partner.Ward);
    }

    if (TDSHelperString.hasValueString(comment?.message)) {
      let phone = "";
      let phoneMatch = comment?.message.toLowerCase().match(this.patternPhone);

      if (phoneMatch && phoneMatch.length > 1) {
        phone = phoneMatch[1];
        phone = phone.replace(/o|O/g, "0");
        form.controls.Telephone.setValue(phone);
      }
    }

    // Gán SP mặc định nếu có
    // if (this.productDefault) {
    //   details.push(this.fb.group(this.productDefault));
    // }
  }

}
