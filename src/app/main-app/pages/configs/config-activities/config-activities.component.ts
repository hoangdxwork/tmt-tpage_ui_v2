import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { addDays, endOfWeek, endOfYear, endOfYesterday, startOfYear, startOfYesterday } from 'date-fns';
import { endOfMonth, startOfMonth } from 'date-fns';
import { startOfWeek } from 'date-fns/esm';
import { OdataTPosLoggingService } from 'src/app/main-app/services/mock-odata/odata-tpos-logging.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TDSTableSortFn, TDSTableSortOrder } from 'tds-ui/table';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSI18nService, vi_VN } from 'tds-ui/i18n';

interface ConfigDateFilter {
  type:string,
  range:Date[]
}
interface ColumnItem {
  name: string;
  sortOrder: TDSTableSortOrder | null;
  sortFn: TDSTableSortFn<TDSSafeAny> | null;
  sortDirections: TDSTableSortOrder[];
}

@Component({
  selector: 'app-config-activities',
  templateUrl: './config-activities.component.html'
})
export class ConfigActivitiesComponent implements OnInit {
  fromDate!: FormControl;
  toDate!: FormControl;
  dateFilter: ConfigDateFilter = {type:'',range:[]};
  TableData:Array<TDSSafeAny> = [];
  listOfColumns: Array<ColumnItem> = [];
  testDate = new Date('Thu Mar 17 2022 17:00:24');

  public filterObj: any = {
    name: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  isLoading: boolean = false;

  lstData: TDSSafeAny;
  pageSize = 20;
  pageIndex = 1;
  count: number = 0;

  isEndData: boolean = false;

  constructor(
    private i18n: TDSI18nService,
    private odataTPosLoggingService: OdataTPosLoggingService
  ) {
    this.i18n.setLocale(vi_VN);
    this.fromDate = new FormControl(null,[Validators.required]);
    this.toDate = new FormControl(null,[Validators.required]);
  }

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
    this.initSortColumn();
  }

  loadData(pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let filters = this.odataTPosLoggingService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.odataTPosLoggingService.getView(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstData = res.value;
        this.isLoading = false;
    });
  }

  initSortColumn(){
    this.listOfColumns = [
      {
        name:'Thời gian',
        sortDirections: ['ascend', 'descend', null],
        sortOrder:null,
        sortFn:(a:TDSSafeAny, b:TDSSafeAny) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime()
      },
      {
        name:'Trạng thái',
        sortDirections: ['ascend', 'descend', null],
        sortOrder:null,
        sortFn:(a:boolean, b:boolean) => b ? 1 : -1
      }
    ]
  }

  doFilter(event:TDSSafeAny){
    this.filterObj.searchText = event.target.value;

    this.loadData(this.pageSize, this.pageIndex);
  }

  selectDateFilter(type:String){
    switch(type){
      case 'today':{
        this.dateFilter = {
          type:'today',
          range: [new Date(), new Date()]
        };
        break;
      }
      case 'yesterday':{
        this.dateFilter = {
          type:'yesterday',
          range: [startOfYesterday(), endOfYesterday()]
        };
        break;
      }
      case 'thisWeek':{
        this.dateFilter = {
          type:'thisWeek',
          range: [startOfWeek(new Date),endOfWeek(new Date)],
        };
        break;
      }
      case 'thisMonth':{
        this.dateFilter = {
          type:'thisMonth',
          range: [startOfMonth( new Date()), endOfMonth(new Date())],
        };
        break;
      }
      case 'thisYear':{
        this.dateFilter = {
          type:'thisYear',
          range: [startOfYear(new Date()),endOfYear(new Date())],
        };
        break;
      }
      case 'range':{
        this.dateFilter.type = 'range';
        if(this.fromDate.value != null && this.toDate.value != null){
          this.dateFilter.range =[this.fromDate.value,this.toDate.value];
        }
        break;
      }
    }
  }

  resetDateFilter(){
    this.filterObj = {
      name: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onDateFilter(){
    this.filterObj.dateRange.startDate = this.dateFilter.range[0];
    this.filterObj.dateRange.endDate = this.dateFilter.range[1];

    this.loadData(this.pageSize, this.pageIndex);
  }

  pageIndexChange(event: number) {
    if(event * this.pageSize >= this.count) {
      this.isEndData = true;
    }
    else {
      this.isEndData = false;
    }
  }
}
