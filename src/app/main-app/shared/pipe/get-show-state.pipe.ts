import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getShowState'
})
export class GetShowStatePipe implements PipeTransform {

  transform(type: string): string {
    switch (type) {
        case 'draft':
        return 'Nháp';
        case 'cancel':
        return 'Hủy bỏ';
        case 'open':
        return 'Xác nhận';
        case 'paid':
        return 'Đã thanh toán';
    }
    return '---';
  }
}