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

export interface Data {
    id?: any;
    message: string;
    created_time: Date;
    from: From;
    to: To;
    attachments?: any;
}

export interface ResponseAddMessCommentDtoV2 {
    Id: string;
    TenantId: string;
    ChannelType: number;
    ChannelId: string;
    ConversationId: string;
    UserId: string;
    CreatedById?: any;
    CreatedBy?: any;
    CreatedTime: Date;
    ChannelCreatedTime: Date;
    ChannelUpdatedTime?: any;
    MessageType: number;
    ContentType?: any;
    MessageId: string;
    ObjectId?: any;
    Object?: any;
    ParentId?: any;
    Parent?: any;
    Message: string;
    Source?: any;
    Attachments?: any;
    Mentions?: any;
    ExtraProperties: ExtraProperties;
    Error?: any;
    Status: number;
    IsSystem: boolean;
    IsOwner: boolean;
    Data: Data;
    name?: string; // không có trong api trả về, là Name page (Data.from.name)
}