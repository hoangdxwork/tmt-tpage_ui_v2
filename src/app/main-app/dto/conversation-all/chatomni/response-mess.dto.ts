export interface responseAddMessCommentDto {
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