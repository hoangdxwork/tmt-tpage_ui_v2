import { Color } from 'echarts';
import { TDSChartOptions, TDSLineChartComponent, TDSLineChartDataSeries } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-daily-report',
  templateUrl: './dashboard-daily-report.component.html',
  styleUrls: ['./dashboard-daily-report.component.scss']
})
export class DashboardDailyReportComponent implements OnInit {
  //#region variable
  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  labelData = [
    {
      value:300,
      percent:20,
      decrease:false
    },
    {
      value:300,
      percent:20,
      decrease:true
    },
    {
      value:300,
      percent:20,
      decrease:false
    }
  ];
  emptyData = false;

  dailyOption:any;
  chartOption = TDSChartOptions();
  axisData:TDSSafeAny[] = [];
  seriesData:TDSSafeAny[] = [];
  colors:Color[] = [];
  //#endregion

  currentTeam!: CRMTeamDTO | null;
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  dataCurrentDate: MDBTotalCommentMessageFbDTO[] = [];
  dataOverviewCurrentDay!: MDBSummaryByPostDTO;

  constructor(
    private crmTeamService: CRMTeamService,
    private reportFacebookService: ReportFacebookService
  ) { }

  ngOnInit(): void {
    this.loadAxisData();
    this.loadCurrentTeam();
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
      this.loadSummaryCurrentDay(this.currentTeam?.Facebook_PageId);
      this.loadSummaryOverviewCurrentDay(this.currentTeam?.Facebook_PageId);
    });
  }

  loadSummaryCurrentDay(pageId: string | undefined) {
    this.isLoading = true;
    this.reportFacebookService.getSummaryCurrentDay('')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.dataCurrentDate = res;
        this.loadSeriesData(res);
        this.loadDataChart();
      }, error => this.emptyData = true);
  }

  loadSummaryOverviewCurrentDay(pageId: string | undefined) {
    this.reportFacebookService.getSummaryOverviewCurrentDay('').subscribe(res => {
      this.dataOverviewCurrentDay = res;
    });
  }

  loadAxisData() {
    this.axisData = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  }

  loadSeriesData(data: MDBTotalCommentMessageFbDTO[]) {
    let dataMessage: number[] = [];

    this.axisData.forEach((axis) => {
      let find = data.find(x => JSON.stringify(x.Hours) === axis);
      dataMessage.push(find?.TotalMessage || 0);
    });

    this.seriesData = [
      {
        name: 'Tin nhắn',
        data: dataMessage
      }
    ];
  }

  loadDataChart(){
    this.colors = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    let chart:TDSLineChartComponent ={
      color:this.colors,
      tooltip:{
        show:true,
        position:'top',
        trigger: 'axis',
        axisPointer:{
          type:'line',
          lineStyle:{
            color:'#C4C4C4',
            type:'solid'
          }
        },
        formatter:'<div class="flex flex-row rounded-xl p-2">'+
                    '<div class="bg-white rounded-full flex items-center justify-center h-[34px] w-[34px]">'+
                      '<i class="tdsi-time-fill text-primary-1"></i>'+
                    '</div>'+
                    '<div class="pl-2">'+
                      '<span class="text-neutral-1-500 text-caption-2 font-regular font-sans text-center pb-2">Thứ 6, {b}:00 01/11/2022</span><br>'+
                      '<div class="flex flex-row items-center justify-between text-white text-caption-2 font-semibold font-sans text-center">'+
                        '<span class="pr-5">5 bình luận</span>'+
                        '<span>{c} {a}</span>'+
                      '</div>'+
                    '</div>'+
                  '</div>',
        borderColor:'transparent',
        backgroundColor:'rgba(0, 0, 0, 0.8)'
      },
      grid:{
        top:16,
        right:16,
        bottom:36
      },
      axis:{
        xAxis:[
          {
            data: this.axisData,
            boundaryGap:false,
            axisTick:{
              show:false
            },
            axisLine:{
              lineStyle:{
                color:'#E9EDF2',
                width:1
              }
            },
            axisLabel:{
              margin:16,
              color:'#2C333A',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              interval:1,
              align:'center',
              width:17
            }
          }
        ],
        yAxis:[
          {
            axisLabel:{
              margin:40,
              color:'#2C333A',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'left',
            },
            interval:50,
            splitLine:{
              lineStyle:{
                color:'#C4C4C4',
                width:1.2,
                type:[5,5],
                opacity:0.6
              }
            }
          }
        ]
      },
      series: this.getSeries(this.seriesData)
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart : TDSLineChartComponent ){
    this.dailyOption = this.chartOption.LineChartOption(chart,true);
    this.dailyOption.xAxis[0].axisLabel.showMinLabel = true;
  }

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSLineChartDataSeries[] = [];
    seriesData.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'line',
          smooth:true,
          showSymbol:false,
          symbolSize:12,
          areaStyle:{
            opacity:0.2,
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#28A745'
              }, {
                  offset: 1, color: '#FFF'
              }],
              global: false
            }
          },
          data: series.data
        }
      );
    });
    return list;
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }

  refreshData() {
    this.loadSummaryCurrentDay(this.currentTeam?.Facebook_PageId);
    this.loadSummaryOverviewCurrentDay(this.currentTeam?.Facebook_PageId);
  }
}
