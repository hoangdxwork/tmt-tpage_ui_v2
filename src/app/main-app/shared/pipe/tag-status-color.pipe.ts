import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagStatusColor'
})

export class TagStatusColorPipe implements PipeTransform {
  transform(status: string): any {
    switch (status) {
      case "Đơn hàng":
        return "primary";
      case "Nháp":
        return "info";
      case "Hủy":
        return "warning";
      case "Hủy bỏ":
        return "secondary";
      case "Bom hàng":
        return "error";
      case "Đã thanh toán":
        return "success";
      default:
        return "secondary";
    }
  }

}
