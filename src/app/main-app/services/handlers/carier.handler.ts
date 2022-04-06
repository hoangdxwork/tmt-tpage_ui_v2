import { Injectable } from "@angular/core";






@Injectable({
  providedIn: 'root'
})
export class CarrierHandler {

  private delivery_types: any = ["fixed", "base_on_rule", "VNPost", "NinjaVan"];

  // Đối tác có phí báo hiểm
  private carrierTypeInsurance: any = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan"];

  // Danh sách đối tác hỗ trợ tính phí
  private apiDeliveries: any = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', "HolaShip"];


  constructor(
  ) {

  }

  existApiDeliveries(apiDeliveries: string) {
    return this.apiDeliveries.includes(apiDeliveries);
  }

  existCarrierTypeInsurance(carrierTypeInsurance: string) {
    return this.carrierTypeInsurance.includes(carrierTypeInsurance);
  }

  existDeliveryTypes(DeliveryTypes: string) {
    return this.delivery_types.includes(DeliveryTypes);
  }

  initGHTK(carrier: any, shipExtraServices: any): boolean {
    shipExtraServices = shipExtraServices || [];

    if (carrier && carrier.DeliveryType === 'GHTK') {
      let shipExtras = carrier.ExtrasText ? JSON.parse(carrier.ExtrasText) : null;
      let isInsurance = shipExtras && shipExtras.IsInsurance;

      shipExtraServices.length = 0;

      shipExtraServices.push(
        {
          ServiceId: '16',
          ServiceName: 'Bảo hiểm hàng hóa',
          Fee: 0,
          IsSelected: isInsurance
        },
      );

      return true;
    }

    return false;
  }

  initOkieLa(carrier: any, shipExtraServices: any): boolean {
    shipExtraServices = shipExtraServices || [];

    if (carrier && carrier.DeliveryType === 'OkieLa') {
      shipExtraServices.length = 0;

      shipExtraServices.push(
        {
          ServiceId: 'is_fragile',
          ServiceName: 'Hàng dễ vỡ?'
        },
        {
          ServiceId: 'check_before_accept',
          ServiceName: 'Cho khách xem hàng?'
        },
      );

      return true;
    }

    return false;
  }

  initNinjaVan(carrier: any, shipExtraServices: any): boolean {
    shipExtraServices = shipExtraServices || [];

    let shipExtras = carrier && carrier.ExtrasText ? JSON.parse(carrier.ExtrasText) : null;

    if (carrier && carrier.DeliveryType === 'NinjaVan' && shipExtras) {
      shipExtraServices.length = 0;

      shipExtraServices.push(
        {
          ServiceId: "NinjaVan",
          ServiceName: "Khai giá hàng hóa",
          Fee: shipExtras.InsuranceFee ? shipExtras.InsuranceFee : 0,
          IsSelected: shipExtras.IsInsurance ? shipExtras.IsInsurance : false,
        },
      );

      return true;
    }

    return false;
  }

  changeCarrier(saleModel: any, carrier: any, saleSettingDefault?: any) {
    // Cập nhật giá trị ship mặc định
    if (carrier && (carrier.Config_DefaultFee > 0 || carrier.Config_DefaultFee == 0)) {
      saleModel.DeliveryPrice = carrier.Config_DefaultFee;
    }
    else if (saleSettingDefault && saleSettingDefault.ShipAmount) {
      saleModel.DeliveryPrice = saleSettingDefault.ShipAmount;
    }
    else if (saleModel.DeliveryPrice) {
      saleModel.DeliveryPrice = saleModel.DeliveryPrice;
    }
    else {
      saleModel.DeliveryPrice = 0;
    }

    // Cập nhật khối lượng mặc định
    if (carrier && carrier.Config_DefaultWeight) {
      saleModel.ShipWeight = carrier.Config_DefaultWeight;
    }
    else if (saleSettingDefault && saleSettingDefault.Weight) {
      saleModel.ShipWeight = saleSettingDefault.Weight;
    }
    else {
      saleModel.ShipWeight = 100;
    }

    // Cập nhật giao hàng bổ xung
    if (carrier && carrier.ExtrasText) {
      saleModel.Ship_Extras = JSON.parse(carrier.ExtrasText);
    }

  }

}
