import { FormControl, Validators } from '@angular/forms';
import { TDSSafeAny, TDSTableFilterFn, TDSTableFilterList, TDSTableSortFn, TDSTableSortOrder } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { endOfWeek, endOfYear, endOfYesterday, getISOWeek, startOfYear, startOfYesterday } from 'date-fns';
import { en_US, TDSI18nService, vi_VN } from 'tmt-tang-ui';
import { endOfMonth, startOfMonth } from 'date-fns';
import { startOfWeek } from 'date-fns/esm';
import { util } from 'echarts';

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
  templateUrl: './config-activities.component.html',
  styleUrls: ['./config-activities.component.scss']
})
export class ConfigActivitiesComponent implements OnInit {
  fromDate!: FormControl;
  toDate!: FormControl;
  dateFilter: ConfigDateFilter = {type:'',range:[]};
  TableData:Array<TDSSafeAny> = [];
  listOfColumns: Array<ColumnItem> = [];
  testDate = new Date('Thu Mar 17 2022 17:00:24');

  constructor(private i18n: TDSI18nService) { 
    this.i18n.setLocale(vi_VN);
    this.fromDate = new FormControl(null,[Validators.required]);
    this.toDate = new FormControl(null,[Validators.required]);
  }

  ngOnInit(): void {
    this.loadData();
    this.initSortColumn();
  }

  loadData(){
    this.TableData = [
      {
        id:1,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Xác nhận bán hàng có mã: INV/2022/0005 .Tổng tiền là: 48.000đ',
        createdDate: new Date('Thu Mar 17 2022 17:00:24'),
        status:true
      },
      {
        id:2,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Hủy bán hàng với KH: 1010Ádsad.Mã hóa đơn: DJDE/2022/0176 Tổng tiền là: 85.000đ',
        createdDate: new Date('Thu Mar 17 2022 17:08:24'),
        status:true
      },
      {
        id:3,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Thêm mới mua hàng với NCC: Công Ty Cổ Phần Công Nghệ Trường Minh Thịnh.Tổng tiền là: 180.000đ',
        createdDate: new Date('Thu Mar 17 2022 17:11:24'),
        status:true
      },
      {
        id:4,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Thêm mới bán hàng với KH: Oanh Le. Tổng tiền là: 0',
        createdDate: new Date('Thu Mar 17 2022 17:10:24'),
        status:false
      },
      {
        id:5,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Cập nhật trả hàng với KH: Hoàng. Tổng tiền là: 480.000đ',
        createdDate: new Date('Web Mar 16 2022 17:20:24'),
        status:false
      },
      {
        id:6,
        image:'assets/images/config/SP1120.png',
        user:'Tpos.vn',
        content:'Xác nhận bán hàng có mã: INV/2022/0005 .Tổng tiền: 48.000đ',
        createdDate: new Date('Thu Mar 17 2022 17:22:24'),
        status:false
      },
    ];
  }

  initSortColumn(){
    this.listOfColumns = [
      {
        name:'createdDate',
        sortDirections: ['ascend', 'descend', null],
        sortOrder:null,
        sortFn:(a:TDSSafeAny, b:TDSSafeAny) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      },
      {
        name:'status',
        sortDirections: ['ascend', 'descend', null],
        sortOrder:null,
        sortFn:(a:boolean, b:boolean) => b ? 1 : -1
      }
    ]
  }

  doFilter(event:TDSSafeAny){

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

  }

  onDateFilter(){

  }
}
