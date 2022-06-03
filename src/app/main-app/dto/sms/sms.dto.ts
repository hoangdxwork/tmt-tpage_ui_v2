export interface CRMGenerateMessageByPhoneDTO {
    PartnerId: number;
    Message: string;
    Phone: string;
    Name: string;
}

export interface RestSMSDTO {
    Id?: number;
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

export interface CategorySMSDTO {
    key: number;
    datasource?: string;
    Price: number;
}

export interface customPropertiesSMSDTO{
    type: CategorySMSDTO;
    secretkey: string;
}

export interface ListSMSDTO {
    provider: string;
    name: string;
    apiurl: string;
    categories: CategorySMSDTO[];
}