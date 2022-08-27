import { Injectable } from "@angular/core";
import { CompanyCurrentDTO } from "@app/dto/configs/company-current.dto";
import { ChatomniDataItemDto } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SaleOnlineSettingDTO } from "@app/dto/setting/setting-sale-online.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { CRMTeamService } from "@app/services/crm-team.service";
import { TDSHelperString } from "tds-ui/shared/utility";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable()

export class CsOrder_PrepareModelHandler {

  public phoneRegex = /(?:\b|[^0-9])((0|o|84|\+84)(\s?)([2-9]|1[0-9])(\d|o(\s|\.)?){8})(?:\b|[^0-9])/;
  saleConfig!: SaleOnlineSettingDTO;

  constructor(private crmTeamService: CRMTeamService) {}

  public prepareInsertFromMessage(model: QuickSaleOnlineOrderModel, team: CRMTeamDTO) {

    let x = {} as InsertFromMessageDto;
    if(!TDSHelperString.hasValueString(model.Id)) {
        delete x.Id;
    } else {
        x.Id = model.Id;
    }

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

    return {...x};
  }

  public prepareInsertFromPost(comment: ChatomniDataItemDto, saleOnlineSetting: SaleOnlineSettingDTO, companyCurrents: CompanyCurrentDTO) {

    let x = {} as InsertFromPostDto;
    let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;

    x.Name = comment.Data?.from?.name;
    x.CRMTeamId = team.Id;
    x.Facebook_ASUserId = comment.UserId;
    x.Facebook_CommentId = comment.Data?.id;
    x.Facebook_PostId = comment.ObjectId;
    x.Facebook_UserName = comment.Data?.from?.name;
    x.PartnerName = comment.Data?.from?.name;

    x.Facebook_Comments = [this.prepareFacebookComment(comment)];

    //TODO: check sdt cấu hình mặc định
    let config = JSON.parse(companyCurrents.Configs);
    if(config && config.PhoneRegex) {
      this.phoneRegex = config.PhoneRegex;
    }

    if(this.phoneRegex && comment.Message) {
      let regex = new RegExp(this.phoneRegex);
      let exec = regex.exec(comment.Message) as any[];
      if(exec) {
          let phone = exec[1].trim();
          x.Telephone = phone;
      }
    }

    if(saleOnlineSetting && saleOnlineSetting.enablePrintComment) {
        x.Note =  `{before}${comment.Message}`;
    }

    return {...x};
  }

  public prepareFacebookComment(comment: ChatomniDataItemDto) {
    let item = {} as SaleOnline_Order_Facebook_CommentDto;

    item["id"] = comment.Data.id;
    item["message"] = comment.Message;
    item["created_time"] = String(comment.CreatedTime);
    item["created_time_converted"] = comment.CreatedTime;
    item["can_hide"] = comment.Data?.can_hide;
    item["can_remove"] = comment.Data?.can_remove;
    item["like_count"] = comment.Data?.like_count;
    item["post_id"] = comment.ObjectId;
    item["object"] = comment.Data?.object;
    item["from"] = comment.Data?.from;
    item["attachment"] = comment.Data?.attachment;

    if (comment.Data.comments && comment.Data.comments.length > 0) {
      item["comments"] = comment.Data.comments.map(x => this.prepareFacebookComment(x));
    }

    return {...item};
  }


}

export interface SaleOnline_Order_Facebook_CommentDto {
  id: string;
  message: string;
  created_time: string;
  created_time_converted: Date | any;
  can_hide?: boolean;
  can_remove?: boolean;
  can_reply_privately: boolean;
  like_count?: number;
  comment_count: number;
  view_id: number;
  post_id: string;
  object: any;
  from: any;
  comments: any[];
  attachment: any[];
  SaleOnlineDeliveyInfo: any;
}

export interface InsertFromPostDto {
  Name: string;
  CRMTeamId: number;
  Facebook_UserId: string;
  Facebook_CommentId: string;
  Facebook_Comments: SaleOnline_Order_Facebook_CommentDto[];
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_PostId: string;
  Note: string;
  UserId: string;
  PartnerName: string;
  Telephone: string;
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
