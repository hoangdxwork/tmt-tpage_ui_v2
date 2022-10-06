import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class CreateFormBillHandler {

  public createForm(_form: FormGroup, fb: FormBuilder) {
    _form = fb.group({
      Id: [null],
      Account: [null],
      AccountId: [null],
      Company: [null],
      CompanyId: [null],
      Partner: [null],
      PartnerId: [null],
      PriceList: [null],
      PriceListId: [null],
      Warehouse: [null],
      WarehouseId: [null],
      Journal: [null],
      JournalId: [null],
      PaymentJournal: [null],
      PaymentJournalId: [null],
      PaymentAmount: [0],
      Team: [null],
      TeamId: [null],
      Deliver: [null],
      PreviousBalance: [null],
      Reference: [null],
      Revenue: [0],
      Carrier: [null],
      CarrierId: [null],
      DeliveryPrice: [0],
      AmountDeposit: [0],
      CashOnDelivery: [0],
      ShipWeight: [0],
      DeliveryNote: [null],
      Ship_InsuranceFee: [0],
      CustomerDeliveryPrice: [null],
      TrackingRef: [null],
      Ship_Receiver: fb.group({
        City: [null],
        District: [null],
        Ward: [null],
        Name: [null],
        Phone: [null],
        Street: [null]
      }),
      Address: [null],
      ReceiverName: [null],
      ReceiverPhone: [null],
      ReceiverDate: [null],
      ReceiverAddress: [null],
      ReceiverNote: [null],
      User: [null],
      UserId: [null],
      DateOrderRed: [null],
      State: [null],
      DateInvoice: [new Date()],
      NumberOrder: [null],
      Comment: [null],
      Seri: [null],
      WeightTotal: [0],
      DiscountAmount: [0],
      Discount: [0] as unknown as number,
      DecreaseAmount: [0],
      AmountUntaxed: [0],
      AmountTax: [0],
      Type: [null],
      SaleOrder: [null],
      AmountTotal: [0],
      TotalQuantity: [0],
      Tax: [null],
      TaxId: [null],
      Ship_ServiceId: [null],
      Ship_ServiceName: [null],
      Ship_ExtrasText: [null],
      Ship_ServiceExtrasText: [null],
      Ship_Extras: [null],

      Ship_ServiceExtras: fb.array([]),
      OrderLines: fb.array([]),

      ShipmentDetailsAship: fb.group({
          ConfigsProvider: new FormArray([]),
          InsuranceInfo: [null]
      }),
      NewCredit: [0],
      OldCredit: [0],
    })

    return _form;
  }
}
