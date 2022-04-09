export interface SuggestCitiesDTO {
    code: string;
    name: string;
}

export interface SuggestDistrictsDTO {
    cityCode: string;
    cityName: string;
    code: string;
    name: string;
}

export interface SuggestWardsDTO {
    cityCode: string;
    cityName: string;
    districtCode: string;
    districtName: string;
    code: string;
    name: string;
}
