
export interface OnChatBotSignalRModel {
    action: string;
    companyId: number;
    data: DataCvsChatBotModel;
    enableAlert: boolean;
    enablePopup: boolean;
    error: boolean;
    message: string;
    type: string;
}

export interface DataCvsChatBotModel {
    name: string;
    pageId: string;
    psid: string;
}

export enum TypeOnChatBot {
    AdminTransferChatBot = "AdminTransferChatBot",
    ChatbotTranserAdmin= "ChatbotTranserAdmin",
}
