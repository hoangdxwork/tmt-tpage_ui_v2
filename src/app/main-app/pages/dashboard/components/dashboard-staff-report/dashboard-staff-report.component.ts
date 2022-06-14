import { finalize } from 'rxjs/operators';
import { Color } from 'echarts';
import { TDSPieChartComponent, TDSChartOptions } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { SummaryActivityByStaffDTO, SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-staff-report',
  templateUrl: './dashboard-staff-report.component.html',
  styleUrls: ['./dashboard-staff-report.component.scss']
})
export class DashboardStaffReportComponent implements OnInit {
  //#region variable
  staffOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  // filterList= [
  //   {id:1, name:'Tuần này'},
  //   {id:2, name:'Tháng này'}
  // ]
  // currentFilter = this.filterList[0].name;
  colors:Color[] = [];
  staffsData:TDSSafeAny[] = [];
  emptyData = false;
  //#endregion

  currentFilter!: SummaryFilterDTO;
  filterList: SummaryFilterDTO[] = [];
  isLoading: boolean = false;

  lstSummaryActivityByStaff: SummaryActivityByStaffDTO[] = [];

  constructor(
    private summaryFacade: SummaryFacade,
    private reportFacebookService: ReportFacebookService
  ) { }

  ngOnInit(): void {
    this.loadFilter();
    this.loadOverviewEmploy();
  }

  loadFilter() {
    this.filterList = this.summaryFacade.getFilter();
    this.currentFilter = this.filterList[0];
  }

  loadOverviewEmploy() {
    let startDate = this.currentFilter.startDate.toISOString();
    let endDate = this.currentFilter.endDate.toISOString();

    this.isLoading = true;

    this.reportFacebookService.getSummaryByStaffs(startDate, endDate)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstSummaryActivityByStaff = res;
        this.loadDataChart(this.lstSummaryActivityByStaff);
      }, error => this.emptyData = true);
  }

  loadDataChart(data: SummaryActivityByStaffDTO[]){
    this.staffsData = [];

    this.staffsData = data.map(x => {
      return {
        id: x.StaffId,
        name: x.StaffName,
        value: x.TotalCount
      }
    });

    this.colors= ['#28A745','#2684FF','#FF8900'];

    if(this.staffsData.length == 0){
      this.emptyData = true;
    }

    let chart:TDSPieChartComponent = {
      color:this.colors,
      tooltip:{
        show:true,
        position:'right',
        borderColor:'#FFF',
        formatter:function(params:TDSSafeAny){
          return '<span class="text-neutral-1-900 text-body-2 font-semibold font-sans">'+params.name+'</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tương tác</span><span class="text-neutral-1-900 pl-4 text-body-2 font-semibold font-sans">'+params.value+' tương tác</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tỉ lệ</span><span class="text-neutral-1-900 pl-14 text-body-2 font-semibold font-sans">'+params.percent+'%</span>'
        }
      },
      series:[
        {
          type:'pie',
          center:['52%','52%'],
          clockwise:false,
          startAngle:90,
          width:260,
          height:260,
          label:{
            show:true,
            position:'center',
            padding:[40,24],
            backgroundColor:'#F2FCF5',
            borderRadius:999,
            formatter: '{highlight|{d}%}\n{avatar|}{header|{b}}\n{body| {c} tương tác}',
            rich:{
              header:{
                color:'#2C333A',
                fontStyle:'normal',
                fontSize:16,
                lineHeight:24,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                padding:[-14,0,0,12],
              },
              body:{
                color:'#929DAA',
                fontStyle:'normal',
                fontSize:14,
                lineHeight:20,
                fontWeigth:400,
                fontFamily:'Segoe UI',
                padding:[-28,0,0,32],
              },
              highlight:{
                color:'#28A745',
                fontStyle:'normal',
                fontSize:40,
                lineHeight:53.2 ,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'center'
              },
              avatar:{
                width:36,
                height:36,
                backgroundColor:{
                  image:'../../../assets/imagesv2/Avatar-user.png'
                }
              }
            }
          },
          emphasis:{
            scale:false
          },
          itemStyle:{
            borderWidth:2,
            borderColor:'#fff',
          },
          data: this.staffsData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSPieChartComponent){
    this.staffOption = this.chartOption.DonutChartOption(chart,130,102);
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
    this.loadOverviewEmploy();
  }
}
