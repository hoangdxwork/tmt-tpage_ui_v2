import { Injectable } from "@angular/core";
import { ResultCheckAddressDTO } from "src/app/main-app/dto/address/address.dto";
import { QuickSaleOnlineOrderModel } from "src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class ConversationOrderHandler {

  static onLoadSuggestion(item: ResultCheckAddressDTO, quickOrderModel: QuickSaleOnlineOrderModel) {
    quickOrderModel.Address = item.Address ? item.Address : quickOrderModel.Address;

    quickOrderModel.CityCode = item.CityCode ? item.CityCode : quickOrderModel.CityCode;
    quickOrderModel.CityName = item.CityName ? item.CityName : quickOrderModel.CityName;

    quickOrderModel.DistrictCode = item.DistrictCode ? item.DistrictCode : quickOrderModel.DistrictCode;
    quickOrderModel.DistrictName = item.DistrictName ? item.DistrictName : quickOrderModel.DistrictName;

    quickOrderModel.WardCode = item.WardCode ? item.WardCode : quickOrderModel.WardCode;
    quickOrderModel.WardName = item.WardName ? item.WardName : quickOrderModel.WardName;
  }

  static prepareInsertFromMessage(model: QuickSaleOnlineOrderModel) {
    let x = {} as InsertFromMessageModel;

    x.Address = model.Address;
    x.CityCode = model.CityCode;
    x.CityName = model.CityName;
    x.DistrictCode = model.DistrictCode;
    x.DistrictName = model.DistrictName;
    x.WardCode = model.WardCode;
    x.WardName = model.WardName;

    x.Code = model.Code;
    x.CRMTeamId = model.CRMTeamId;
    x.Email = model.Email;
    x.Facebook_ASUserId = model.Facebook_ASUserId;
    x.Facebook_UserId = model.Facebook_UserId;
    x.Facebook_UserName = model.Facebook_UserName;
    x.Id = model.Id;
    x.Name = model.Name;
    x.Note = model.Note;
    x.PartnerId = model.PartnerId;
    x.PartnerName = model.PartnerName;
    x.Telephone = model.Telephone;
    x.TotalAmount = model.TotalAmount;
    x.TotalQuantity = model.TotalQuantity;

    x.User = {
      Id: model.UserId,
      Name: model.UserName
    }
    x.UserId = model.UserId;

    x.Details = [];
    model.Details.map(obj => {
      let item = {
          Note: obj.Note,
          Price: obj.Price,
          ProductId: obj.ProductId,
          ProductName: obj.ProductName,
          ProductNameGet: obj.ProductNameGet,
          ProductCode: obj.ProductCode,
          Quantity: obj.Quantity,
          UOMId: obj.UOMId,
          UOMName: obj.UOMName
      }

      x.Details.push(item);
    })

    return x;
  }
}

export interface InsertFromMessageModel {
  Id?: string;
  Code?: any;
  Details: Detail_InsertFromMessageModel[];
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  PartnerName: string;
  Name: string;
  Email?: any;
  TotalAmount: number;
  TotalQuantity: number;
  Address: string;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardName: string;
  WardCode: string;
  PartnerId: number;
  UserId: string;
  User: User_InsertFromMessage;
  Telephone: string;
  Note?: any;
  CRMTeamId: number;
}

export interface Detail_InsertFromMessageModel {
  Price: number;
  ProductCode: string;
  ProductId: number;
  ProductName: string;
  ProductNameGet: string;
  Quantity: number;
  UOMId: number;
  UOMName: string;
  Note: string;
}

export interface User_InsertFromMessage {
  Id: string;
  Name: string;
}

