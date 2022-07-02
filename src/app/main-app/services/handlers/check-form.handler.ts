import { Injectable } from "@angular/core";
import { FastSaleOrderService } from '../fast-sale-order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryCarrierService } from '../delivery-carrier.service';
import { DeliveryCarrierDTO } from '../../dto/carrier/delivery-carrier.dto';
import { CommonService } from '../common.service';
import { GeneralConfigsFacade } from '../facades/general-config.facade';
import { FormGroup } from '@angular/forms';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../crm-team.service';
import { FastSaleOrderLineDTO, FastSaleOrder_ReceiverDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';
import { SaleOnline_OrderDTO, SaleOnline_Order_FacebookCommentDTO } from '../../dto/saleonlineorder/sale-online-order.dto';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { TDSModalService } from "tds-ui/modal";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { FastSaleOrderRestDTO } from "../../dto/saleonlineorder/saleonline-order-red.dto";


@Injectable({
  providedIn: 'root'
})
export class CheckFormHandler {

  lstCarriers!: DeliveryCarrierDTO[];
  saleConfig: TDSSafeAny;
  billDefault$!: Observable<FastSaleOrderRestDTO>;

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
  prepareOrder(formOrder: FormGroup): SaleOnline_OrderDTO {
    let formValue = formOrder.value;
    let model = {} as SaleOnline_OrderDTO;
    let user = {Id: formValue.User?.Id, Name: formValue.User?.Name} as ApplicationUserDTO;

    model.Id =formValue.Id ? formValue.Id : null,
    model.Code = formValue.Code ? formValue.Code : null,
    model.Details = formValue.Details,
    model.Facebook_UserId = formValue.Facebook_UserId,
    model.Facebook_ASUserId = formValue.Facebook_ASUserId,
    model.Facebook_UserName = formValue.Facebook_UserName || formValue.PartnerName,
    model.Facebook_CommentId = formValue.Facebook_CommentId,
    model.Facebook_Comments = formValue.Facebook_Comments || [],
    model.Facebook_PostId = formValue.Facebook_PostId,
    model.PartnerName = formValue.PartnerName,
    model.Name = formValue.PartnerName || formValue.Name,
    model.Email = formValue.Email,
    model.TotalAmount = formValue.TotalAmount || 0,
    model.TotalQuantity = formValue.TotalQuantity || 0,
    model.Address = formValue.Street[0],
    model.CityCode = formValue.City ? formValue.City.Code : null,
    model.CityName = formValue.City ? formValue.City.Name : null,
    model.DistrictCode = formValue.District ? formValue.District.Code : null,
    model.DistrictName = formValue.District ? formValue.District.Name : null,
    model.WardName = formValue.Ward ? formValue.Ward.Name : null,
    model.WardCode = formValue.Ward ? formValue.Ward.Code : null,
    model.PartnerId = formValue.PartnerId,
    model.UserId = formValue.User ? formValue.User.Id : null,
    model.User = formValue.User ? user : undefined,
    model.Telephone = formValue.Telephone,
    model.Note = formValue.Note,
    model.CRMTeamId = this.currentTeam ? this.currentTeam.Id : null

    if (!model.Id) {
      model.Id = undefined;
      model.Code = undefined;
    }

    return model;
  }

  prepareBill(orderForm: FormGroup, billModel: FastSaleOrderRestDTO, shipExtraServices: TDSSafeAny[]): FastSaleOrderRestDTO {
    let model = billModel;
    let formValue = orderForm.value;

    model.SaleOnlineIds = [formValue.Id];
    model.PartnerId = formValue.PartnerId;
    model.Partner = formValue.Partner && formValue.Partner.Id ? formValue.Partner.Id : null;
    model.Name = formValue.PartnerName || formValue.Facebook_UserName;
    model.PartnerPhone = formValue.Telephone;
    // model.PartnerName = formValue.PartnerName || formValue.Facebook_UserName;
    model.Address = formValue.Address || formValue.Street;
    model.FacebookId = formValue.Facebook_UserId;
    model.FacebookName = formValue.Facebook_UserName || formValue.Name || formValue.PartnerName;
    model.Facebook_ASUserId = formValue.Facebook_ASUserId;
    // model.Telephone = formValue.Telephone;

    model.Tax = formValue.Tax;
    model.AmountDeposit = formValue.AmountDeposit;
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

    model.Carrier = model.Carrier != null && model.Carrier.Id ? model.Carrier : undefined;
    model.CarrierId = model.Carrier != null && model.Carrier.Id ? model.Carrier.Id : undefined;

    model.PaymentJournalId = model.PaymentJournal != null ? model.PaymentJournal.Id : undefined;

    // Xóa detail gán lại
    model.OrderLines = [];

    formValue.Details.forEach((detail: TDSSafeAny) => {
      if (!model.OrderLines)
        model.OrderLines = [];

        let orderLine = {} as FastSaleOrderLineDTO;
        orderLine.ProductId = detail.ProductId,
        orderLine.ProductUOMId = detail.UOMId,
        orderLine.ProductUOMQty = detail.Quantity,
        orderLine.PriceUnit = detail.Price,
        orderLine.Discount = detail.Discount || 0,
        orderLine.Discount_Fixed = detail.Discount || 0,
        orderLine.Type = "fixed",
        orderLine.PriceSubTotal = detail.Price * detail.Quantity,
        orderLine.Note = detail.Note

        model.OrderLines.push(orderLine);
    });

    let ship_Receiver = {} as FastSaleOrder_ReceiverDTO;
    ship_Receiver.Name = formValue.PartnerName || formValue.Name,
    ship_Receiver.Phone = formValue.Telephone,
    ship_Receiver.Street = formValue.Street,
    ship_Receiver.City = formValue.City,
    ship_Receiver.District = formValue.District,
    ship_Receiver.Ward = formValue.Ward

    model.Ship_Receiver = ship_Receiver;

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

    model.PageId = this.currentTeam ? this.currentTeam.Facebook_PageId : undefined;
    model.PageName = this.currentTeam ? this.currentTeam.Facebook_PageName : undefined;

    return model;
  }

  prepareOrderComment(dataComment: any): SaleOnline_Order_FacebookCommentDTO { // Chưa có data DTO
    let model = {} as SaleOnline_Order_FacebookCommentDTO;

    model.id = dataComment.id;
    model.message = dataComment.message;
    model.created_time = String(dataComment.created_time);
    model.created_time_converted = dataComment.created_time;
    model.can_hide = dataComment.can_hide;
    model.can_remove = dataComment.can_remove;
    model.like_count = dataComment.like_count;
    model.is_hidden = dataComment.is_hidden;
    model.post_id = dataComment.object && dataComment.object.id;
    model.object = dataComment.object;
    model.from = dataComment.from;
    model.attachment = dataComment.attachment;

    if (dataComment.comments && dataComment.comments.data) {
      model["comments"] = dataComment.comments.data.map((x: any) => this.prepareOrderComment(x));
    }

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

    if (!TDSHelperString.hasValueString(bill.PartnerPhone)) {
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

    if(!TDSHelperString.hasValueString(bill.Name)) {
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
