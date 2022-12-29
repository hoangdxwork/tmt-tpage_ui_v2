import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { QuickSaleOnlineOrderModel } from '../../dto/saleonlineorder/quick-saleonline-order.dto';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniConversationInfoDto, ConversationPartnerDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';

@Injectable()

export class ConversationOrderFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  // Event loading tab partner, order
  public onChangeTab$ = new EventEmitter<ChangeTabConversationEnum>();

  // Event Output
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();

  // output dùng để đẩy dữ liệu sang conversation-order
  public onLastOrderCheckedConversation$: EventEmitter<QuickSaleOnlineOrderModel> = new EventEmitter<QuickSaleOnlineOrderModel>();

  // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
  public onSelectOrderFromMessage$: EventEmitter<any> = new EventEmitter<any>();

  // TODO: chọn sản phẩm từ tds-conversation sang tab đơn hàng
  public onAddProductOrder$:EventEmitter<any> = new EventEmitter<any>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Khách hàng
  public loadPartnerByPostComment$ = new EventEmitter<ChatomniConversationInfoDto>();

  // TODO: thông tin đơn hàng khi click khách hàng từ comment
  public loadOrderByPartnerComment$ = new EventEmitter<ChatomniConversationInfoDto>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Đơn hàng
  public loadInsertFromPostFromComment$ = new EventEmitter<any>();

  // TODO:click code đơn hàng từ bài viết
  public loadOrderFromCommentPost$ = new EventEmitter<any>();

  // TODO: output có thông tin đơn hàng khi bấn thông tin khách hàng để Disable tab đơn hàng
  public hasValueOrderCode$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService) {
        super(apiService);
  }

  prepareMessageHasPhoneBBCode(message: string) {
    if(TDSHelperString.hasValueString(message)) {
      let exist = message.includes('[format') && message.includes('[end_format]') && message.includes("type='text-copyable'");
      if(exist) {
          let phone: string = '';
          let format: string = '';

          let indexOf = message.indexOf('[format') && message.indexOf('[end_format]');
          if(indexOf > 0) {
            let sub1 = message.indexOf('[format');
            if(sub1 > 0) {
              format = message.substring(sub1);
            }

            let sub2 = format.lastIndexOf('[end_format]');
            if(sub2 > 0 && format) {
                format = format.substring(sub2);
            }
          }

          if(indexOf > 0) {
            let start =  message.indexOf("value='");
            let end =  message.indexOf( "']");
            if(start > 0 && end > 0) {
                phone = message.substring(start, end).replace("value='", "").trim();
            }
          }
      }
    }

    return message;
  }


}
