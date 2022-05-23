import { Injectable } from "@angular/core";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { SummaryFilterDTO } from "../../dto/dashboard/summary-overview.dto";

@Injectable()
export class SummaryFacade {

  filterList: SummaryFilterDTO[] = [
    {id: 1, name:'Tuần này', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id: 2, name:'Tháng này', startDate: addDays(new Date(), -30), endDate: new Date()}
  ];

  constructor() {
    this.updateFilter();
  }

  updateFilter() {
    let dateNow = new Date();

    let startOFWeek = startOfWeek(dateNow, { weekStartsOn: 1 });
    let endOFWeek = endOfWeek(dateNow, { weekStartsOn: 1 });

    this.filterList[0].startDate = startOFWeek;
    this.filterList[0].endDate = endOFWeek;

    let startOFMonth = startOfMonth(dateNow);
    let endOFMonth = endOfMonth(dateNow);

    this.filterList[1].startDate = startOFMonth;
    this.filterList[1].endDate = endOFMonth;
  }

  getFilter(): SummaryFilterDTO[] {
    return this.filterList;
  }

}
