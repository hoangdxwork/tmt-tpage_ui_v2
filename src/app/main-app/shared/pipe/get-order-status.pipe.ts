import { TDSTagStatusType } from 'tds-ui/tag';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getOrderStatus'
})
export class GetOrderStatusPipe implements PipeTransform {

  transform(state: string, lstStatus: any[]): string {
    return lstStatus.find(f=>f.State == state)?.ShowState || 'Tất cả';
  }
}


@Pipe({
  name: 'getColorStatusShowState'
})
export class getColorStatusShowStatePipe implements PipeTransform {

  transform(status: string ): TDSTagStatusType {
    switch(status) {
      case "Đã xác nhận":
        return "info";
      case "Đã thanh toán":
        return "success";
      case "Nháp":
        return "secondary";
      default :
        return "error";
    }
  }
}

@Pipe({
  name: 'getColorStatusState'
})
export class GetColorStatusStatePipe implements PipeTransform {

  transform(status: string ): TDSTagStatusType {
    switch(status) {
      case "draft":
        return "secondary";
      case "paid":
        return "primary";
      case "open":
        return "info";
      case "cancel":
          return "error";
      default:
        return "warning";
    }
  }
}

@Pipe({
  name: 'getColorStatusText'
})
export class GetColorStatusTextPipe implements PipeTransform {

  transform(status: string ): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đơn hàng":
        return "success";
      case "Hủy":
        return "error";
      default:
        return "warning";
    }
  }
}