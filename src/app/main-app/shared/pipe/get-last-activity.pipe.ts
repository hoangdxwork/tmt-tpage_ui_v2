import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getLastActivity' })

export class GetLastActivityPipe implements PipeTransform {

    transform(value: any, type: any): any {
      if(type == "message" && value.last_message) {
          return value.last_message;
      }
      else if(type == "comment" && value.last_comment){
          return value.last_comment;
      }
      else if(value.last_activity) {
          return value.last_activity || {};
      }
      return null;
    }
}
