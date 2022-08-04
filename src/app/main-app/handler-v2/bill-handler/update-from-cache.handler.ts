import { FastSaleOrderService } from './../../services/fast-sale-order.service';
import { Observable } from 'rxjs';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { FastSaleOrder_DefaultDTOV2 } from './../../dto/fastsaleorder/fastsaleorder-default.dto';
import { THelperCacheService } from './../../../lib/utility/helper-cache';
import { Injectable } from "@angular/core";
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';

@Injectable()

export class UpdateFromCacheHandler {
    constructor(private cacheApi: THelperCacheService,
        private saleOnlineOrderService: SaleOnline_OrderService) { }

    public loadCacheOrder(data: FastSaleOrder_DefaultDTOV2) {
        return new Observable<FastSaleOrder_DefaultDTOV2>((observer: any) => {
            const key = this.saleOnlineOrderService._keyCreateBillOrder;
            
            this.cacheApi.getItem(key).subscribe((res) => {
                if (TDSHelperObject.hasValue(res)) {
                    let model = JSON.parse(res?.value)?.value;
                    
                    if (TDSHelperObject.hasValue(model)) {
                        data.SaleOnlineIds = model.ids;
                        data.Reference = model.Reference;
                        data.Partner = model.partner;
                        data.Comment = model.comment || '';
                        data.FacebookId = model.facebookId;
                        data.FacebookName = model.facebookName;
                        data.IsProductDefault = model.isProductDefault;
                        data.PartnerId = model.Id;
                        //Check kho hàng
                        if (model.warehouse) {
                            data.Warehouse = model.warehouse;
                        }
                        data.ReceiverName = model.partner.DisplayName;
                        let orderLines: any[] = [];
    
                        for (var item of model.orderLines) {
                            orderLines.push({
                                AccountId: item.AccountId,
                                Discount: item.Discount || 0,
                                Discount_Fixed: item.Discount_Fixed || 0,
                                Note: item.Note,
                                PriceRecent: item.PriceRecent || 0,
                                PriceSubTotal: item.PriceSubTotal || 0,
                                PriceTotal: item.PriceTotal || 0,
                                PriceUnit: item.PriceUnit || 0,
                                Product: item.Product,
                                ProductId: item.ProductId,
                                ProductName: item.ProductName,
                                ProductNameGet: item.Product.NameGet,
                                ProductUOM: item.ProductUOM,
                                ProductUOMId: item.ProductUOMId,
                                ProductUOMName: item.ProductUOMName,
                                ProductUOMQty: item.ProductUOMQty,
                                Type: item.Product.Type,
                                Weight: item.Weight || 0,
                                WeightTotal: 0
                            });
                        }
    
                        data.OrderLines = [...orderLines];

                        //TODO: trường hợp lấy cache thành công (tạo mới hóa đơn bên đơn hàng)
                        this.cacheApi.removeItem(key);
                        observer.next(data);
                        observer.complete();
                    }
                }else{
                    //TODO: trường hợp cache không được tạo (tạo mới hóa đơn bên phiếu bán hàng)
                    observer.next(data);
                    observer.complete();
                }
            },
            err => {
                //TODO: trường hợp lấy cache bị lỗi
                this.cacheApi.removeItem(key);
                observer.next(err);
                observer.complete();
            });
        });
    }
}