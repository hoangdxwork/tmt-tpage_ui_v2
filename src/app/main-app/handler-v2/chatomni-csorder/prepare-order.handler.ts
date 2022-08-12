import { Injectable } from "@angular/core";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { TDSHelperString } from "tds-ui/shared/utility";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable({
  providedIn: 'root'
})

export class CsOrder_PrepareModelHandler {

  public  prepareInsertFromMessage(model: QuickSaleOnlineOrderModel, team: CRMTeamDTO) {

    let x = {} as InsertFromMessageDto;

    x.Address = model.Address;
    x.CityCode = model.CityCode;
    x.CityName = model.CityName;
    x.DistrictCode = model.DistrictCode;
    x.DistrictName = model.DistrictName;
    x.WardCode = model.WardCode;
    x.WardName = model.WardName;

    x.Code = model.Code;
    x.CRMTeamId = model.CRMTeamId || team.Id;
    x.Email = model.Email;
    x.Facebook_ASUserId = model.Facebook_ASUserId;
    x.Facebook_UserId = model.Facebook_UserId;
    x.Facebook_UserName = model.Facebook_UserName;
    x.Id = model.Id;
    x.Name = model.Name;
    x.Note = model.Note;
    x.PartnerId = model.PartnerId;
    x.PartnerName = model.PartnerName || model.Partner?.Name;
    x.Telephone = model.Telephone;
    x.TotalAmount = model.TotalAmount;
    x.TotalQuantity = model.TotalQuantity;

    x.User = {
      Id: model.UserId || model.User?.Id,
      Name: model.UserName || model.User?.Name,
    }
    x.UserId = model.UserId || model.User?.Id;

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

export interface InsertFromMessageDto {
  Id?: string;
  Code?: any;
  Details: Detail_InsertFromMessageDto[];
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
  FormAction?: string;
}

export interface Detail_InsertFromMessageDto {
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
