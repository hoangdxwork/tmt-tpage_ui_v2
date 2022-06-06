import { Injectable } from "@angular/core";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { SummaryFilterDTO } from "../../dto/dashboard/summary-overview.dto";

@Injectable()
export class SummaryFacade {

  private filterList: SummaryFilterDTO[] = [
    {id: 1, name:'Tuần này', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id: 2, name:'Tháng này', startDate: addDays(new Date(), -30), endDate: new Date()}
  ];

  private filterMultipleLists: SummaryFilterDTO[] = [
    {id: 1, name:'7 ngày qua', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id: 2, name:'30 ngày qua', startDate: addDays(new Date(), -30), endDate: new Date()},
    {id: 3, name:'Tuần này', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id: 4, name:'Tháng này', startDate: addDays(new Date(), -30), endDate: new Date()},
    {id: 5, name:'Tháng trước', startDate: addDays(new Date(), -60), endDate: addDays(new Date(), -30)}
  ];

  constructor() {
    this.updateFilter();
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
