export interface CRMGenerateMessageByPhoneDTO {
    PartnerId: number;
    Message: string;
    Phone: string;
    Name: string;
}

export interface RestSMSDTO {
    Id: number;
    Name: string;
    Provider: string;
    ApiUrl: string;
    CustomProperties: string;
    ApiKey: string;
}

export interface SendMessageSMSDTO {
    Datas: CRMGenerateMessageByPhoneDTO[];
    ApiKey: string;
    Provider: string;
    ApiUrl: string;
    CustomProperties: string;
}