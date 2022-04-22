import { TagDTO } from './../../tag/tag.dto';
import { ConfigProductInventoryDTO } from './config-inventory.dto';
import { ConfigStockMoveDTO } from './config-warehouse.dto';
import { ConfigProductTemplateDTO } from './../product/config-product.dto';
export interface ODataProductTemplateDTO {
    "@odata.context"?: string;
    "@odata.count"?: number;
    value: ConfigProductTemplateDTO[];
}

export interface ODataStokeMoveDTO {
    "@odata.context"?: string;
    "@odata.count"?: number;
    value: ConfigStockMoveDTO[];
}

export interface ODataProductInventoryDTO {
    "@odata.context"?: string;
    "@odata.count"?: number;
    value: ConfigProductInventoryDTO[];
}

export interface ODataProductTagDTO {
    "@odata.context"?: string;
    "@odata.count"?: number;
    value: TagDTO[];
}