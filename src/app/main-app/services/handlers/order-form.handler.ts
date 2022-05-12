import { FormBuilder } from '@angular/forms';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { FastSaleOrderService } from '../fast-sale-order.service';
import { map } from 'rxjs/operators';
import { GeneralConfigsFacade } from '../facades/general-config.facade';
import { TDSSafeAny } from 'tmt-tang-ui';
import { TAuthService } from 'src/app/lib';
import { SaleSettingsDTO } from '../../dto/setting/setting-sale-online.dto';
import { FastSaleOrderRestDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';

@Injectable()
export class OrderFormHandler {

  saleSetting!: SaleSettingsDTO;
  companyId: TDSSafeAny;
  billDefault$!: Observable<FastSaleOrderRestDTO>;

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

}
