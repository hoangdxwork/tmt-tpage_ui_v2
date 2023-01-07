import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';

export interface ProductComboDto {
    ProductId: number,
    Quantity: number,
    Product: ProductDTOV2
}

export interface ProductTemplateComboDto {
    Id: number;
    ProductId: number;
    ProductTemplateId: number;
    Quantity: number;
    Product: ProductDTOV2;
}

export interface ODataComboProductTemplateDto {
    "@odata.context": string;
    value: ProductTemplateComboDto[];
}
