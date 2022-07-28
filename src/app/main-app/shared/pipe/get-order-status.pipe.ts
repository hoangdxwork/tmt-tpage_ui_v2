import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getOrderStatus'
})
export class GetOrderStatusPipe implements PipeTransform {

  transform(state: string, lstStatus: any[]): string {
    return lstStatus.find(f=>f.State == state)?.ShowStatus || 'Tất cả';
  }
}
