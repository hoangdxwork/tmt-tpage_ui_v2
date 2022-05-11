import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { FastSaleOrderService } from '../fast-sale-order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FastSaleOrderDTO } from '../../dto/bill/bill.dto';
import { map } from 'rxjs/operators';
import { FastSaleOrderDefaultDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';
import { DeliveryCarrierService } from '../delivery-carrier.service';
import { DeliveryCarrierDTO } from '../../dto/carrier/delivery-carrier.dto';
import { CommonService } from '../common.service';
import { GeneralConfigsFacade } from '../facades/general-config.facade';
import { FormGroup } from '@angular/forms';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../crm-team.service';


@Injectable({
  providedIn: 'root'
})
export class CheckFormHandler {

  lstCarriers!: DeliveryCarrierDTO[];
  saleConfig: TDSSafeAny;
  billDefault$!: Observable<FastSaleOrderDefaultDTO>;
  fastSaleOrderFormDefault!: FastSaleOrderDefaultDTO;

  currentTeam!: CRMTeamDTO | null;

  constructor(
    private fastSaleOrderService: FastSaleOrderService,
    private deliveryCarrierService: DeliveryCarrierService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private crmTeamService: CRMTeamService,
    private modalService: TDSModalService
  ) {
    this.loadData();
  }

  loadData() {
    this.deliveryCarrierService.dataCarrierActive$.subscribe(res => {
      this.lstCarriers = res;
    });

    this.crmTeamService.onChangeTeam().subscribe(res => {
      this.currentTeam = res;
    });
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfig = res;
    });
  }

  checkValueModelCalculateFeeV2(model: TDSSafeAny) {
    let result = { status: false, model: null, error: "" };

    if (!model.ShipWeight || model.ShipWeight == 0) {
      result.error = "Khối lượng phải lớn hơn 0";
      return result;
    }

    result.status = result.error ? false : true;
    result.model = model;

    return result;
  }

  // Handling prepare form
  prepareOrder(formOrder: FormGroup) {
    let formValue = formOrder.value;

    let model = {
      Id: formValue.Id ? formValue.Id : null,
      Code: formValue.Code ? formValue.Code : null,
      Details: formValue.Details,
      Facebook_UserId: formValue.Facebook_UserId,
      Facebook_ASUserId: formValue.Facebook_ASUserId,
      Facebook_UserName: formValue.Facebook_UserName || formValue.PartnerName,
      PartnerName: formValue.PartnerName,
      Name: formValue.PartnerName || formValue.Name,
      Email: formValue.Email,
      TotalAmount: formValue.TotalAmount || 0,
      TotalQuantity: formValue.TotalQuantity || 0,
      Address: formValue.Street,
      CityCode: formValue.City ? formValue.City.Code : null,
      CityName: formValue.City ? formValue.City.Name : null,
      DistrictCode: formValue.District ? formValue.District.Code : null,
      DistrictName: formValue.District ? formValue.District.Name : null,
      WardName: formValue.Ward ? formValue.Ward.Name : null,
      WardCode: formValue.Ward ? formValue.Ward.Code : null,
      PartnerId: formValue.PartnerId,
      UserId: formValue.User ? formValue.User.Id : null,
      User: formValue.User ? {Id: formValue.User.Id, Name: formValue.User.Name} : null,
      Telephone: formValue.Telephone,
      Note: formValue.Note,
      CRMTeamId: this.currentTeam ? this.currentTeam.Id : null
    };

    if (!model.Id) {
      delete model.Id;
      delete model.Code;
    }

    return model;
  }

  prepareBill(orderForm: FormGroup, billModel: TDSSafeAny, shipExtraServices: TDSSafeAny[]) {
    let model = billModel;

    let formValue = orderForm.value;

    model.SaleOnlineIds = [formValue.Id];
    model.PartnerId = formValue.PartnerId;
    model.Partner = formValue.Partner && formValue.Partner.Id ? formValue.Partner.Id : null;
    model.PartnerName = formValue.PartnerName || formValue.Facebook_UserName;
    model.Address = formValue.Address || formValue.Street;
    model.FacebookId = formValue.Facebook_UserId;
    model.FacebookName = formValue.Facebook_UserName || formValue.Name || formValue.PartnerName;
    model.Facebook_ASUserId = formValue.Facebook_ASUserId;
    model.Telephone = formValue.Telephone;

    model.Tax = formValue.Tax;
    model.Discount = formValue.Discount;
    model.AmountTax = formValue.AmountTax;
    model.AmountUntaxed = formValue.AmountUntaxed;
    model.DecreaseAmount = formValue.DecreaseAmount;
    model.DiscountAmount = formValue.DiscountAmount;
    model.PaymentAmount = formValue.PaymentAmount || 0;

    model.TaxId = formValue.Tax ? formValue.Tax.Id : null;
    model.User = formValue.User;
    model.UserId = formValue.User ? formValue.User.Id : null

    model.CompanyId = model.Company ? model.Company.Id : 0;
    model.AccountId = model.Account ? model.Account.Id : 0;
    model.JournalId = model.Journal ? model.Journal.Id : 0;
    model.PriceListId = model.PriceList ? model.PriceList.Id : 0;
    model.WarehouseId = model.Warehouse ? model.Warehouse.Id : 0;

    model.Carrier = model.Carrier != null && model.Carrier.Id ? model.Carrier : null;
    model.CarrierId = model.Carrier != null && model.Carrier.Id ? model.Carrier.Id : null;

    model.PaymentJournalId = model.PaymentJournal != null ? model.PaymentJournal.Id : null;

    // Xóa detail gán lại
    model.OrderLines = [];

    formValue.Details.forEach((detail: TDSSafeAny) => {
      if (!model.OrderLines)
        model.OrderLines = [];

      model.OrderLines.push({
        ProductId: detail.ProductId,
        ProductUOMId: detail.UOMId,
        ProductUOMQty: detail.Quantity,
        PriceUnit: detail.Price,
        Discount: 0,
        Discount_Fixed: 0,
        Type: "fixed",
        PriceSubTotal: detail.Price * detail.Quantity,
        Note: detail.Note
      });
    });

    model.Ship_Receiver = {
      Name: formValue.PartnerName || formValue.Name,
      Phone: formValue.Telephone,
      Street: formValue.Street,
      City: formValue.City,
      District: formValue.District,
      Ward: formValue.Ward
    };

    if (shipExtraServices) {
      model.Ship_ServiceExtras = [];

      shipExtraServices.map((x: any) => {
        if (x.IsSelected) {
          model.Ship_ServiceExtras.push({
            Id: x.ServiceId,
            Name: x.ServiceName,
            Fee: x.Fee,
            ExtraMoney: x.ExtraMoney,
            Type: x.Type,
          });
        }
      });
    }

    model["PageId"] = this.currentTeam ? this.currentTeam.Facebook_PageId : null
    model["PageName"] = this.currentTeam ? this.currentTeam.Facebook_PageName : null;

    return model;
  }

  // Kiểm tra dữ liệu khi lưu
  checkValueOrder(order: TDSSafeAny) {

  }

  checkValueBill(bill: TDSSafeAny): string | null {
    let errorMessage = null;

    let detail = bill.OrderLines;

    if (!detail || detail.length === 0) {
      errorMessage = "Hãy nhập sản phẩm.";
    }

    if (!TDSHelperString.hasValueString(bill.Telephone)) {
      errorMessage = "Hãy nhập số điện thoại.";
    }

    if (!TDSHelperString.hasValueString(bill.Address)) {
      errorMessage = "Hãy nhập địa chỉ.";
    }

    if (!TDSHelperString.hasValueString(bill?.Ship_Receiver?.City?.Code)) {
      errorMessage = "Hãy nhập tỉnh/thành phố.";
    }

    if (!TDSHelperString.hasValueString(bill?.Ship_Receiver?.District?.Code)) {
      errorMessage = "Hãy nhập quận/huyện.";
    }

    if(bill.DeliveryPrice == null) {
      errorMessage = "Hãy nhập phí giao hàng.";
    }

    if(bill.DeliveryPrice != 0 && bill.DeliveryPrice < 0) {
      errorMessage = "Phí giao hàng phải lớn hơn 0.";
    }

    if(!TDSHelperString.hasValueString(bill.PartnerName)) {
      errorMessage = "Hãy nhập tên khách hàng.";
    }

    return errorMessage;
  }

  checkShipServiceId(model: TDSSafeAny): number {
    if (model.Carrier && model.Carrier.Id &&
      (model.Carrier.DeliveryType === "ViettelPost" ||
      model.Carrier.DeliveryType === "GHN" ||
      model.Carrier.DeliveryType === "TinToc" ||
      model.Carrier.DeliveryType == 'NinjaVan'))
    {

      if (model.Carrier.DeliveryType === "GHN") {
        model.Ship_ServiceId = model.Ship_ServiceId || model.Carrier.GHN_ServiceId;
      }
      else if (model.Carrier.DeliveryType === "ViettelPost" || model.Carrier.DeliveryType === "TinToc") {
        model.Ship_ServiceId = model.Ship_ServiceId || model.Carrier.ViettelPost_ServiceId;
      }
      else if(model.Carrier.DeliveryType == 'NinjaVan') {
        model.Ship_ServiceId = 'Standard';
        model.Ship_ServiceName = 'Tiêu chuẩn';
      }

      if (!model.Ship_ServiceId) {
        return 0;
      }
    }

    return 1;
  }


}
