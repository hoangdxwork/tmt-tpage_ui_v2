import { ConfigDataFacade } from './../../../services/facades/config-data.facade';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { addDays, endOfWeek, endOfYear, endOfYesterday, getISOWeek, startOfYear, startOfYesterday } from 'date-fns';
import { endOfMonth, startOfMonth } from 'date-fns';
import { startOfWeek } from 'date-fns/esm';
import { util } from 'echarts';
import { TposLoggingFilterObjDTO } from 'src/app/main-app/dto/odata/odata.dto';
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

  public filterObj: TposLoggingFilterObjDTO = {
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
    private odataTPosLoggingService: OdataTPosLoggingService,
    private configDataService: ConfigDataFacade
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
    this.configDataService.onLoading$.emit(this.isLoading);
    let filters = this.odataTPosLoggingService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.odataTPosLoggingService.getView(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstData = res.value;
        this.isLoading = false;
        this.configDataService.onLoading$.emit(this.isLoading);
    });
  }

  // loadData(){
  //   this.TableData = [
  //     {
  //       id:1,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Xác nhận bán hàng có mã: INV/2022/0005 .Tổng tiền là: 48.000đ',
  //       createdDate: new Date('Thu Mar 17 2022 17:00:24'),
  //       status:true
  //     },
  //     {
  //       id:2,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Hủy bán hàng với KH: 1010Ádsad.Mã hóa đơn: DJDE/2022/0176 Tổng tiền là: 85.000đ',
  //       createdDate: new Date('Thu Mar 17 2022 17:08:24'),
  //       status:true
  //     },
  //     {
  //       id:3,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Thêm mới mua hàng với NCC: Công Ty Cổ Phần Công Nghệ Trường Minh Thịnh.Tổng tiền là: 180.000đ',
  //       createdDate: new Date('Thu Mar 17 2022 17:11:24'),
  //       status:true
  //     },
  //     {
  //       id:4,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Thêm mới bán hàng với KH: Oanh Le. Tổng tiền là: 0',
  //       createdDate: new Date('Thu Mar 17 2022 17:10:24'),
  //       status:false
  //     },
  //     {
  //       id:5,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Cập nhật trả hàng với KH: Hoàng. Tổng tiền là: 480.000đ',
  //       createdDate: new Date('Web Mar 16 2022 17:20:24'),
  //       status:false
  //     },
  //     {
  //       id:6,
  //       image:'../../../assets/imagesv2/config/SP1120.png',
  //       user:'Tpos.vn',
  //       content:'Xác nhận bán hàng có mã: INV/2022/0005 .Tổng tiền: 48.000đ',
  //       createdDate: new Date('Thu Mar 17 2022 17:22:24'),
  //       status:false
  //     },
  //   ];
  // }

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
