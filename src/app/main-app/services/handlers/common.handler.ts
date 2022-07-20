import { Injectable } from "@angular/core";
import { endOfMonth, endOfWeek, endOfYesterday, startOfMonth, startOfWeek, startOfYesterday, subDays } from "date-fns";

export interface TDSDateRangeDTO {
  id: number;
  name: string;
  startDate: Date,
  endDate: Date;
}

@Injectable({
  providedIn: 'root'
})

export class CommonHandler {

  public tdsDateRanges: TDSDateRangeDTO[] = [
    {id: 1, name:'Hôm nay', startDate: new Date(), endDate: new Date()},
    {id: 2, name:'Hôm qua', startDate: startOfYesterday(), endDate: endOfYesterday()},
    {id: 3, name:'7 ngày qua', startDate: subDays(new Date(), 7), endDate: new Date()},
    {id: 4, name:'30 ngày qua', startDate: subDays(new Date(), 30), endDate: new Date()},
    {id: 5, name:'Tuần này', startDate: startOfWeek( new Date()), endDate: endOfWeek(new Date())},
    {id: 6, name:'Tháng này', startDate: startOfMonth( new Date()), endDate: endOfMonth(new Date())},
    {id: 7, name:'Tháng trước', startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0)}
  ]

  public currentDateRanges: TDSDateRangeDTO = this.tdsDateRanges[4];

}
