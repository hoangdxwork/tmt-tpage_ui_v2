import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { Pipe, PipeTransform } from "@angular/core";
import { ChatmoniSocketEventName } from "@app/services/socket-io/soketio-event";

@Pipe({
  name: 'getSocketName'
})
export class GetSocketNamePipe implements PipeTransform {

  transform(name: string): string {
    switch (name) {
      case 'socket.all':
        return 'Bật/Tắt thông báo socket';

      case ChatmoniSocketEventName.chatomniOnMessage:
        return 'Thông báo khi có tin nhắn gửi về';

        case CRMTeamType._Facebook:
          return 'Tin nhắn Facebook';

        case CRMTeamType._TShop:
          return 'Tin nhắn TShop';

        case CRMTeamType._TikTok:
          return 'Tin nhắn TikTok';

      case ChatmoniSocketEventName.chatomniOnUpdate:
        return 'Thông báo tin nhắn lỗi';

      case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
        return 'Thông báo tạo đơn hàng';

      case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
        return 'Thông báo xóa đơn hàng';

      case ChatmoniSocketEventName.livecampaign_CartCheckout:
        return 'Tạo hóa đơn';

      case ChatmoniSocketEventName.chatomniPostLiveEnd:
        return 'Kết thúc live';

      case ChatmoniSocketEventName.chatomniCreatePost:
        return 'Thông báo bài viết mới TShop';
    }
    return '---';
  }
}

@Pipe({
  name: 'checkSocketTeamType'
})
export class CheckSocketTeamTypePipe implements PipeTransform {
  transform(name: string): boolean { 
    let exist = name == CRMTeamType._Facebook || name == CRMTeamType._TShop || name == CRMTeamType._TikTok;
    if(exist) {
      return true;
    }
    return false;
  }
}
