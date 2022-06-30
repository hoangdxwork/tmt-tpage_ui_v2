import { Injectable } from "@angular/core";
import { addDays, endOfMonth, endOfWeek, endOfYesterday, startOfMonth, startOfWeek, startOfYesterday, subDays } from "date-fns";
import { SummaryFilterDTO } from "../../dto/dashboard/summary-overview.dto";

@Injectable()
export class SummaryFacade {

  private filterList: SummaryFilterDTO[] = [
    {id: 1, name:'Tuần này', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id: 2, name:'Tháng này', startDate: addDays(new Date(), -30), endDate: new Date()}
  ];

  private filterMultipleLists: SummaryFilterDTO[] = [
    {id:1, name:'Hôm nay', startDate: new Date(), endDate: new Date()},
    {id:2, name:'Hôm qua', startDate: startOfYesterday(), endDate: endOfYesterday()},
    {id:3, name:'7 ngày qua', startDate: subDays(new Date(), 7), endDate: new Date()},
    {id:4, name:'30 ngày qua', startDate: subDays(new Date(), 30), endDate: new Date()},
    {id:5, name:'Tuần này', startDate: startOfWeek( new Date()), endDate: endOfWeek(new Date())},
    {id:6, name:'Tháng này', startDate: startOfMonth( new Date()), endDate: endOfMonth(new Date())},
    {id:7, name:'Tháng trước', startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0)}
  ];

  constructor() {
  }

  private updateFilter() {
    let dateNow = new Date();

    // Tuần này
    let startOFWeek = startOfWeek(dateNow, { weekStartsOn: 1 });
    let endOFWeek = endOfWeek(dateNow, { weekStartsOn: 1 });

    this.filterMultipleLists[2].startDate = startOFWeek;
    this.filterMultipleLists[2].endDate = endOFWeek;

    this.filterList[0] = this.filterMultipleLists[2];

    // Tháng này
    let startOFMonth = startOfMonth(dateNow);
    let endOFMonth = endOfMonth(dateNow);

    this.filterMultipleLists[4].startDate = startOFMonth;
    this.filterMultipleLists[4].endDate = endOFMonth;

    this.filterList[1] = this.filterMultipleLists[3];

    // Tháng trước
    let dateOfLastMonth = addDays(startOFMonth, -1);

    let startOFLastMonth = startOfMonth(dateOfLastMonth);
    let endOFLastMonth = endOfMonth(dateOfLastMonth);

    this.filterMultipleLists[4].startDate = startOFLastMonth;
    this.filterMultipleLists[4].endDate = endOFLastMonth;
  }

  getFilter(): SummaryFilterDTO[] {
    return this.filterList;
  }

  getMultipleFilter() {
    return this.filterMultipleLists
  }

}
