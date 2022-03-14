import { ApplicationUserDTO } from '../account/application-user.dto';
import { CompanyDTO } from '../company/company.dto';
import { ObjectDataDTO } from '../conversation/message.dto';
import { PartnerDTO, PartnerStatus } from '../partner/partner.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';

export class SaleOnlineOrderSummaryStatusDTO {
  public dateStart?: Date;
  public dateEnd?: Date;
  public tagIds: string;
  public searchText: string;
}

export class SaleOnline_OrderDTO {
  public id: string;
  public code: string;

  public facebook_UserId: string;
  public facebook_PostId: string;
  public facebook_ASUserId: string;
  public facebook_CommentId: string;
  public facebook_AttachmentId: string;
  public facebook_UserName: string;
  public facebook_UserAvatar: string;
  public facebook_Content: string;
  private _telephone: string;

  public get Telephone() {
    return this._telephone;
  }

  public set Telephone(str: string) {
    this._telephone = str.trim();
  }

  public address: string;
  public partnerPhone: string;
  public name: string;
  public email: string;
  public note: string;
  public deposit: number;
  public liveCampaignId: string;
  public liveCampaignName: string;

  public partnerId?: number;
  public partner: PartnerDTO;
  public partnerName: string;
  public partnerStatus: PartnerStatus;
  public partnerStatusText: string;
  public partnerCode: string;

  public cityCode: string;
  public cityName: string;
  public districtCode: string;
  public districtName: string;
  public wardCode: string;
  public wardName: string;

  public totalAmount: number;
  public totalQuantity: number;

  public dateCreated: Date;
  public lastUpdated?: Date;

  public status: SaleOnlineOrderStatusType;
  public statusText: string;

  public facebook_CommentsText: string;
  public facebook_Comments: Array<SaleOnline_Order_FacebookCommentDTO>;

  public details: Array<SaleOnline_Order_DetailDTO>;

  public statusStr: string;
  public commentIds: Array<string>;
  public companyId?: number;
  public partnerNameNosign: string;
  public sessionIndex: number;
  public session: number;
  public source: string;
  public source_FacebookUserId: string;
  public source_FacebookMessageId: string;
  public zaloOrderCode: string;
  public zaloOrderId: string;
  public zaloOAId: string;
  public deliveryInfo: string;
  public crmTeamId?: number;
  public matchingId: string;
  public isCreated: boolean;
  public isUpdated: boolean;
  public crmTeamName: string;

  // Hiển thị số lần in
  public printCount: number;
  public userId: string;
  public user: ApplicationUserDTO;
  public tags: string;
  public nameNetwork: string;
  public userName: string;

  public warehouseId?: number;
  public warehouseName: string;
  public warehouse: StockWarehouseDTO;

  public company: CompanyDTO;
  public companyName: string;

  public formAction: string;

  constructor() {
    this.partnerStatus = PartnerStatus.Normal;
    this.commentIds = new Array<string>();
    this.facebook_Comments = new Array<SaleOnline_Order_FacebookCommentDTO>();
    this.details = new Array<SaleOnline_Order_DetailDTO>();
  }
}

export class SaleOnline_Order_FacebookCommentDTO {
  public id: string;
  public message: string;
  public created_time: string;
  public created_time_converted?: Date;
  public can_hide: boolean;
  public can_remove: boolean;
  public like_count: number;
  public comment_count: number;
  public view_id: number;
  public is_hidden: boolean;
  public post_id: string;
  public object: ObjectDataDTO;
  public from: SaleOnline_Facebook_FromDTO;
  public comments: Array<SaleOnline_Order_FacebookCommentDTO>;
  public saleOnlineDeliveyInfo: SaleOnlineDeliveryInfoDTO;

  constructor() {
    this.comments = new Array<SaleOnline_Order_FacebookCommentDTO>();
    this.saleOnlineDeliveyInfo = new SaleOnlineDeliveryInfoDTO();
  }
}

export class SaleOnline_Order_DetailDTO {
  public id: string;
  public quantity: number;
  public price: number;
  public productId?: number;
  public productName: string;
  public productNameGet: string;
  public productCode: string;
  public uomId?: number;
  public uomName: string;
  public note: string;
  public dactor?: number;
  public orderId: string;

  // Thứ tự ưu tiên, thứ tự <= 0 => hiển thị trạng thái hết hàng lúc người dùng cập nhật giỏ hàng
  public priority: number;
  public imageUrl: string;
}

export class SaleOnlineDeliveryInfoDTO {
  public carrierName: string;
  public trackingRef: string;
  public trackingRefSort: string;
  public ship_Weight: string;
  public ship_Fee: number;
  public cod: string;
  public isCOD: boolean;
  public ship_Receiver: ShipReceiverDTO;
}

export class ShipReceiverDTO {
  public name: string;
  public phone: string;
  public address: string;
}

export class SaleOnline_Facebook_FromDTO {
  public id: string;
  public uid: string;
  public asid: string;
  public picture: string;
  public name: string;
  public mobile_phone: string;
}

export enum SaleOnlineOrderStatusType {
  Draft, // Nháp
  Ordered, // Đơn hàng
  Deposited, // Đặt cọc
  Deliveried, // Giao hàng
  Paid, // Thanh toán
  Completed, // Hoàn thành
  Canceled, // Hủy
  Returned, // Trả hàng
  Confirmed, //Xác nhận
}
