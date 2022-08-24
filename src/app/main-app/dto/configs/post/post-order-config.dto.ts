import { CRMTagDTO } from "@app/dto/crm-tag/odata-crmtag.dto";
import { TIDictionary } from "@core/dto";
import { AutoReplyConfigDTO } from "../page-config.dto";

export interface TagOnPatternDTO {
    CrmTag: CRMTagDTO;
    CrmKey: string;
}

export interface AutoOrderProductDTO {
    ProductId: number;
    ProductCode: string;
    ProductName: string;
    ProductNameGet: string;
    Price: number;
    UOMId: number;
    UOMName: string;
    Quantity: number;
    QtyLimit?: any;
    QtyDefault?: any;
    IsEnableRegexQty: boolean;
    IsEnableRegexAttributeValues: boolean;
    IsEnableOrderMultiple: boolean;
    AttributeValues: string[];
    DescriptionAttributeValues: string[];
}

export interface TextContentToOrderDTO {
    Index: number;
    Content: any;
    // selectedWord2s?: string[];
    ContentWithAttributes?: any;
    // selectedWord3s?: string[];
    IsActive: boolean;
    Product: AutoOrderProductDTO | null;
}

export interface ConfigUserDTO {
    Id: string;
    UserName: string;
    Name: string;
    Avatar: string;
}

export interface AutoOrderConfigDTO {
    LiveTitle?: any;
    IsEnableOrderAuto: boolean;
    IsForceOrderWithAllMessage: boolean;
    IsOnlyOrderWithPartner: boolean;
    IsOnlyOrderWithPhone: boolean;
    IsForceOrderWithPhone: boolean;
    IsForcePrintWithPhone: boolean;
    MinLengthToOrder: number;
    MaxCreateOrder: number;
    TextContentToExcludeOrder: string;
    PhonePattern: string;
    EmailPattern: string;
    LiveCampaignId: string;
    LiveCampaignIsActive: boolean;
    TeamId: number;
    TextContentToOrders: TextContentToOrderDTO[];
    ExcludedPhones: string[];
    ExcludedStatusNames: string[];
    IsEnableAutoAssignUser: boolean;
    Users: ConfigUserDTO[] | null;
    IsEnableOrderReplyAuto: boolean;
    OrderReplyTemplate: string;
    IsEnableShopLink: boolean;
    ShopLabel: string;
    ShopLabel2: string;
    IsOrderAutoReplyOnlyOnce: boolean;
}

export interface AutoHiddenConfigDTO {
    IsEnableAutoHideComment: boolean;
    IsEnableAutoHideAllComment: boolean;
    IsEnableAutoHideCommentWithPhone: boolean;
    IsEnableAutoHideCommentWithEmail: boolean;
    ContentOfCommentForAutoHide: string;
    PhonePattern?: any;
    EmailPattern?: any;
}

export interface AutoLabelConfigDTO {
    AssignOnPhone: boolean;
    TagOnPhone: CRMTagDTO;
    AssignOnOrder: boolean;
    TagOnOrder: CRMTagDTO;
    AssignOnPattern: boolean;
    TagOnPattern: TagOnPatternDTO[];
    AssignOnBillDraft: boolean;
    TagOnBillDraft: CRMTagDTO;
    AssignOnBillPrint: boolean;
    TagOnBillPrint: CRMTagDTO;
    AssignOnBillPrintShip: boolean;
    TagOnBillPrintShip: CRMTagDTO;
}

export interface ConversationPostConfigDTO {
    host: string;
    account_id: string;
    fbid: string;
    live_campaign_id?: any;
    live_campaign_name?: any;
    live_campaign_is_active?: any;
    job_id?: any;
    phone_pattern: string;
    email_pattern: string;
    auto_label_config_text: string;
    auto_label_config: AutoLabelConfigDTO;
    auto_order_config_text: string;
    auto_order_config: AutoOrderConfigDTO;
    old_config_text?: any;
    old_config?: any;
    auto_hidden_config_text: string;
    auto_hidden_config: AutoHiddenConfigDTO;
    auto_reply_config_text?: any;
    auto_reply_config?: AutoReplyConfigDTO;
    DateCreated: Date;
    LastUpdated?: any;
}

export interface TBotRequestCallbackFailedDTO {
    Id: string;
    Url: string;
    Data: any;
    Host: string;
    PostId: string;
    ResponseContext: string;
    RequestHeaders: TIDictionary<any>;
    IsCreated: boolean;
    DateCreated: Date;
    LastUpdated?: Date;
  }