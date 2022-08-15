import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';

export interface ComboProductDTO {
    ProductId: number,
    Quantity: number,
    Product: ProductDTOV2
}

export interface ComboProductTemplateDTO {
    Id: number;
    ProductId: number;
    ProductTemplateId: number;
    Quantity: number;
    Product: ProductDTOV2;
}

export interface ODataComboProductTemplateDTO {
    "@odata.context": string;
    value: ComboProductTemplateDTO[];
}
