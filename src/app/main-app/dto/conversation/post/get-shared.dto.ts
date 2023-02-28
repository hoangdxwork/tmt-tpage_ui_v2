export interface Data {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
}

export interface Picture {
    data: Data;
}

export interface From {
    id: string;
    name: string;
    picture: Picture;
}

export interface GetSharedDto {
    id: string;
    description: string;
    permalink_url: string;
    object_id: string;
    from: From;
    created_time: Date;
    updated_time: Date;
}

export interface PartnerShareDto {
    FbName: string;
    FbId: string;
    CountSharedGroup: number;
    CountSharedPersonal: number;
    TotalShares: number;
}

export interface ExcelSharesDto {
    PartnerShares: PartnerShareDto[];
}

export interface PrintSharesDto {
    from: From;
    shareds: GetSharedDto[];
    CountSharedGroup: number;
    CountSharedPersonal: number;
    // $$hashKey: string;
}
