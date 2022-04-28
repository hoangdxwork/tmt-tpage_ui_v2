export interface CRMgenerateMessagePartnersDTO {
    Message: string;
    PartnerName: string;
    Name: string;
    Teams: TeamDTO[];
}

export interface TeamDTO {
    psid: string;
    Id: number;
    Name: string;
    Facebook_PageId: string;
    Facebook_PageName: string;
    Facebook_PageLogo: string;
}

export interface DetailMessageFacebookDTO {
    CRMTeamId: number;
    Facebook_PSId: string;
    Message: string;
}

export interface SendMessageFacebookDTO {
    Details: DetailMessageFacebookDTO[];
    Name: string;
    MailTemplateBody: string;
}