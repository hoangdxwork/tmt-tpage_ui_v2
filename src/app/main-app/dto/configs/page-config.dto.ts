export interface AutoReplyConfigDTO {
  IsEnableAutoReplyComment: boolean;
  IsEnableAutoReplyMultiple: boolean;
  MaxForAutoReplyMultiple: number;
  IsEnableAutoReplyAllComment: boolean;
  IsEnableAutoReplyCommentWithPhone: boolean;
  IsEnableAutoReplyCommentWithEmail: boolean;
  ContentOfCommentForAutoReply: string;
  ContentOfCommentForNotAutoReply: string;
  ContentForAutoReplyWithComment: string;
  IsEnableAutoReplyCommentInMessage: boolean;
  ContentForAutoReplyWithMessage: string;
  PhonePattern?: any;
  EmailPattern?: any;
}

export interface AutoHideCommentDTO {
  IsEnableAutoHideComment: boolean;
  IsEnableAutoHideAllComment: boolean;
  IsEnableAutoHideCommentWithPhone: boolean;
  IsEnableAutoHideCommentWithEmail: boolean;
  ContentOfCommentForAutoHide?: any;
  PhonePattern?: any;
  EmailPattern?: any;
}
