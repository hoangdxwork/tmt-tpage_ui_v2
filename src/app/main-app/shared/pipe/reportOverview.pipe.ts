import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'reportOverview'
})

export class ReportOverviewPipe implements PipeTransform {

  constructor(){}

  transform(previous: any, current: any) : any {
    let res: number = 0;
    if(previous && current){
        res = ((current -  previous)/previous)*100;
    }
    
    return res;
  }
}


