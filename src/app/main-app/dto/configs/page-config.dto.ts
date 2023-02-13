export interface AutoReplyConfigDTO {
  IsEnableAutoReplyComment: boolean;
  IsEnableAutoReplyMultiple: boolean;
  MaxForAutoReplyMultiple: number;
  IsEnableAutoReplyAllComment: boolean;
  IsEnableAutoReplyCommentWithPhone: boolean;
  IsEnableAutoNotReplyCommentWithPhone: boolean;
  IsEnableAutoReplyCommentWithEmail: boolean;
  ContentOfCommentForAutoReply: string;
  ContentOfCommentForNotAutoReply: string;
  ContentForAutoReplyWithComment: string;
  IsEnableAutoReplyCommentInMessage: boolean;
  ContentForAutoReplyWithMessage: string;
  PhonePattern?: any;
  EmailPattern?: any;
  // Cho phép phản hồi tự động khi bình luận tạo đơn tự động không hợp lệ
  IsEnableAutoReplyCommentInNotIsValidToOrder: boolean;
  // Nội dung phản hồi tự động khi bình luận tạo đơn tự động không hợp lệ
  ContentForAutoReplyCommentInNotIsValidToOrder: string;
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

export interface ProfileMessageDTO {
  type: string;
  title: string | null;
  payload: string | null;
  url?: any;
  isActive?: boolean;
  tabSelected?: boolean;
}

export interface QuickQuestionDTO {
  question: string;
  answer?: any;
  payload: string;
  isActive?: boolean;
  tabSelected?: boolean;
}

export interface GreetingDTO {
  connected?:boolean;
  locale: string;
  text: string | null;
  isActive?: boolean;
}

export interface ChannelFacebookConfigDTO {
  host: string;
  fbid?: any;
  page_id: string;
  profile_messages: ProfileMessageDTO[];
  quick_answers: QuickQuestionDTO[];
  greeting: GreetingDTO[];
  get_started: string;
  DateCreated: Date;
  LastUpdated: Date;
  public_id: string;
}

export interface ChannelAutoLabelConfigDTO {
  AssignOnPhone: boolean;
  TagOnPhone: TagOnPhoneDTO;
  AssignOnOrder: boolean;
  TagOnOrder: TagOnOrderDTO;
  AssignOnPattern: boolean;
  TagOnPattern: TagOnPatternDTO[];
  AssignOnBillDraft: boolean;
  TagOnBillDraft: TagOnBillDraftDTO;
  AssignOnBillPrint: boolean;
  TagOnBillPrint: TagOnBillPrintDTO;
  AssignOnBillPrintShip: boolean;
  TagOnBillPrintShip: TagOnBillPrintShipDTO;
}


export interface TagOnPhoneDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface TagOnOrderDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface CrmTagDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface TagOnPatternDTO {
  CrmTag: CrmTagDTO;
  CrmKey: string;
}

export interface TagOnBillDraftDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface TagOnBillPrintDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface TagOnBillPrintShipDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}
