export interface ResponseAddMessCommentDto {
    id: string;
    host: string;
    ActivityCampaignId?: any;
    account_id: string;
    fbid: string;
    to_id: string;
    is_admin: boolean;
    has_admin_required?: any;
    message_formatted: string;
    error_message?: any;
    type: number;
    nlps: any[];
    DateCreated: Date;
    LastUpdated?: any;
    IsCompleted: boolean;
    DateProcessed?: any;
    CountOrder: number;
    HasRepliedWithMessage: boolean;
    reply_id?: any;
    HasRepliedWithComment: boolean;
    CreatedBy: CreatedBy;
    message?: Message;
    attachments?: any;
    status?: number;
    Error: any;
    name?: string;
}


export interface CreatedBy {
    Id: string;
    UserName: string;
    Name: string;
    Avatar: string;
}

export interface Message {
    id: string;
    message: string;
    created_time: Date;
    from: any;
    to: any;
    attachments?: any;
  }

export interface ExtraProperties {
}

export interface From {
    id: string;
    name?: any;
    uid?: any;
}

export interface Datum {
    id: string;
    name?: any;
}

export interface To {
    data: Datum[];
}

export interface Parent {
    id: string;
}

export interface Data {
    id?: any;
    parent: Parent;
    is_hidden: boolean;
    can_hide: boolean;
    can_remove: boolean;
    can_like: boolean;
    can_reply_privately: boolean;
    comment_count: number;
    message: string;
    user_likes: boolean;
    created_time: Date;
    object: Object;
    from: From;
    comments?: any;
    attachment?: any;
    message_tags: any[];
}

export interface ResponseAddMessCommentDtoV2 {
    Id: string;
    TenantId: string;
    ChannelType: number;
    ChannelId: string;
    ConversationId: string;
    UserId: string;
    UserName?: any;
    CreatedById?: any;
    CreatedBy?: any;
    CreatedTime: Date;
    ChannelCreatedTime: Date;
    ChannelUpdatedTime?: any;
    MessageType: number;
    ContentType?: any;
    MessageId: string;
    ObjectId: string;
    Object?: any;
    ParentId?: string;
    Parent?: any;
    Message: string;
    MessageFormatted?: any;
    Source?: any;
    Attachments?: any;
    Mentions?: any;
    ExtraProperties: ExtraProperties;
    Error?: any;
    Status: number;
    NlpEntities: any[];
    IsSystem: boolean;
    IsOwner: boolean;
    Data: Data;
    Order?: any;

    Type: number; // không trong dữ liệu trả về, nó là MessageType để mapping giống data lúc đầu
}