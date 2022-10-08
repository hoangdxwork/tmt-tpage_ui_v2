
export interface LiveCampaignReportProductDto {
    ProductId: number;
    ProductName: string;
    ProductNameNoSign: string;
    ProductQtyInCart: number;
    ProductQtyWaitCheckOut: number;
    ProductQtyCheckOut: number;
    ProductQtyCancelCheckOut: number;
    OrderQtyWaitCheckOut: number;
    OrderQtyCancelCheckOut: number;
    InvoiceQtyCheckOut: number;
    InvoiceQtyCancelCheckOut: number;
}

export interface ODataLiveCampaignReportProductDto {
    '@odata.context': string;
    '@odata.count': number;
    value: LiveCampaignReportProductDto[];
}


