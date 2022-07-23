import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getStatusName'
})
export class GetStatusNamePipe implements PipeTransform {

  transform(type: string, lstStatus: any[]): string {
    return lstStatus.find(f=>f.Type == type)?.Name || 'Tất cả';
  }
}