export interface Datum {
    Time: Date;
    Count: number;
}

export interface Conversations {
    Total: number;
    Data: Datum[];
}

export interface Datum2 {
    Time: Date;
    MessageCount: number;
    CommentCount: number;
}

export interface Messages {
    MessageTotal: number;
    CommentTotal: number;
    Data: Datum2[];
}

export interface SummaryDailyCurrentDTO {
    Conversations: Conversations;
    Messages: Messages;
}

export interface Conversations2 {
    Total: number;
    Data?: any;
}

export interface Messages2 {
    MessageTotal: number;
    CommentTotal: number;
    Data?: any;
}

export interface SummaryDailyPreviousDTO {
    Conversations: Conversations2;
    Messages: Messages2;
}

export interface PercentSummaryDTO {
    Message: number | any;
    Conversation: number | any;
    Comment: number | any;
}

export interface SummaryDailyDTO {
    Current: SummaryDailyCurrentDTO;
    Previous: SummaryDailyPreviousDTO;
    Percent?: PercentSummaryDTO;
}

export interface SummaryTagDTO {
    TagName: string;
    Count: number;
}