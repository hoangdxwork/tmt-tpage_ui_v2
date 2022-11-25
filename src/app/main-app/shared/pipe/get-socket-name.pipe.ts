import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getSocketName'
})
export class GetSocketNamePipe implements PipeTransform {

  transform(name: string): string {
    switch (name) {
      case 'socket.all':
        return 'Tất cả';

      case 'chatomni.on-message':
        return 'Thông báo khi có tin nhắn gửi về';

      case 'chatomni.on-update':
        return 'Thông báo cập nhật đơn hàng';

      case 'created':
        return 'Thông báo tạo đơn hàng';

      case 'deleted':
        return 'Thông báo xóa đơn hàng';

      case 'livecampaign.cart-checkout':
        return '-';

      case 'chatomni.post-live-end':
        return '-';
    }
    return '---';
  }
}
