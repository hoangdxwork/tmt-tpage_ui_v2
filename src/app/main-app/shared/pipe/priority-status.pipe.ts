
import { PriorityStatus } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'priorityStatusColor'
  })
  
  export class PriorityStatusColorPipe implements PipeTransform {
    transform(status: string): any {
      switch (status) {
        case  PriorityStatus.PriorityAll:
          return "primary";
        case PriorityStatus.PreliminaryAPart:
          return "info";
        case PriorityStatus.PreliminaryAll:
          return "warning";
      }
    }
  }
  
  @Pipe({
    name: 'priorityStatusName'
  })
  
  export class PriorityStatusNamePipe implements PipeTransform {
    transform(status: string): any {
      switch (status) {
        case  PriorityStatus.PriorityAll:
          return "Ưu tiên";
        case PriorityStatus.PreliminaryAPart:
          return "Dự bị một phần";
        case PriorityStatus.PreliminaryAll:
          return "Dự bị toàn phần";
      }
    }
  }