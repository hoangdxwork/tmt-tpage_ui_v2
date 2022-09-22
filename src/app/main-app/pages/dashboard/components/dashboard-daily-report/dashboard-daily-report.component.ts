import { TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Color } from 'echarts';
import { TDSChartOptions, TDSLineChartComponent, TDSLineChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-daily-report',
  templateUrl: './dashboard-daily-report.component.html',
  providers: [TDSDestroyService]
})
export class DashboardDailyReportComponent implements OnInit {

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ];
  currentFilter = this.filterList[0].name;
  emptyData = false;

  dailyOption: TDSSafeAny;
  chartOption = TDSChartOptions();
  axisData: TDSSafeAny[] = [];
  seriesData: TDSSafeAny[] = [];
  colors: Color[] = [];

  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  lstData: MDBTotalCommentMessageFbDTO[] = [];
  dataOverviewCurrentDay!: MDBSummaryByPostDTO;
  interval: number = 0;

  constructor(
    private crmTeamService: CRMTeamService,
    private reportFacebookService: ReportFacebookService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
    this.loadAxisData();
    this.loadCurrentTeam();
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.currentTeam = res ? {...res} : null;
        this.loadSummaryCurrentDay(this.currentTeam?.ChannelId);
        this.loadSummaryOverviewCurrentDay(this.currentTeam?.ChannelId);
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Tải dữ liệu lỗi');
      }
    });
  }

  loadSummaryCurrentDay(pageId?: string) {
    this.isLoading = true;
    this.reportFacebookService.getSummaryCurrentDay(pageId || '').pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          if(TDSHelperArray.hasListValue(res)){
            this.lstData = [...res];
            this.loadSeriesData(res);
            this.loadDataChart();
            this.isLoading = false;
          }else{
            this.emptyData = true;
            this.isLoading = false;
          }
        }, 
        error:(err) => {
          this.emptyData = true;
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu lỗi');
        }
      });
  }

  loadSummaryOverviewCurrentDay(pageId?: string) {
    this.reportFacebookService.getSummaryOverviewCurrentDay(pageId || '').subscribe({
      next:(res) => {
        this.dataOverviewCurrentDay = {...res};
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Tải dữ liệu lỗi');
      }
    });
  }

  loadAxisData() {
    this.axisData = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  }

  loadSeriesData(data: MDBTotalCommentMessageFbDTO[]) {
    let dataMessage: number[] = [];
    
    let lstTotalMessage = data.map(f => f.TotalMessage);
    //TODO: lấy 5 giá trị trên trục y
    let calInterval = Math.max(...lstTotalMessage)/5;
    this.interval = Math.round(calInterval); 
    
    this.axisData.forEach((hour) => {
      let find = data.find(x => JSON.stringify(x.Hours) === hour);
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

    let chart:TDSLineChartComponent = {
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
            interval: this.interval,
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
    this.loadSummaryCurrentDay(this.currentTeam?.ChannelId);
    this.loadSummaryOverviewCurrentDay(this.currentTeam?.ChannelId);
  }
}
