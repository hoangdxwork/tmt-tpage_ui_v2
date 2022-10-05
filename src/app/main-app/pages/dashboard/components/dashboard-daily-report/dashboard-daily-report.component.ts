import { SummaryDailyCurrentDTO, SummaryDailyDTO } from './../../../../dto/dashboard/summary-daily.dto';
import { EventSummaryService } from './../../../../services/event-summary.service';
import { formatDate } from '@angular/common';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Color } from 'echarts';
import { TDSChartOptions, TDSLineChartComponent, TDSLineChartDataSeries } from 'tds-report';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { takeUntil } from 'rxjs/operators';
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
  data!: SummaryDailyDTO;
  interval: number = 0;

  constructor(private crmTeamService: CRMTeamService,
    private eventSummaryService: EventSummaryService,
    private message: TDSMessageService,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    this.loadCurrentTeam();
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.currentTeam = res ? {...res} : null;
        this.loadSummaryCurrentDay();
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Tải dữ liệu lỗi');
      }
    });
  }

  loadSummaryCurrentDay() {
    this.isLoading = true;

    this.eventSummaryService.getSummaryCurrentDay().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: SummaryDailyDTO) => {
          if(res && res.Current) {
              this.data = {...res};

              this.loadOverviewData(res);
              this.loadAxisData(res);
              this.loadSeriesData(res);
              this.loadDataChart();

              this.isLoading = false;
              this.cdr.detectChanges();
          } else {
              this.emptyData = true;
              this.isLoading = false;
              this.cdr.detectChanges();
          }
        },
        error:(err) => {
          this.emptyData = true;
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu lỗi');
        }
      });
  }

  loadOverviewData(data:SummaryDailyDTO){
    if(data && data.Current && data.Previous){
      let percentMessage = data.Previous.Messages?.MessageTotal ? ((data.Current.Messages?.MessageTotal - data.Previous.Messages?.MessageTotal)/data.Previous.Messages?.MessageTotal) * 100 : (data.Current.Messages?.MessageTotal) * 100;
      let percentComment = data.Previous.Messages?.CommentTotal ? ((data.Current.Messages?.CommentTotal - data.Previous.Messages?.CommentTotal)/data.Previous.Messages?.CommentTotal) * 100 : (data.Current.Messages?.CommentTotal) * 100;
      let percentConversation = data.Previous.Conversations?.Total != 0 ? ((data.Current.Conversations?.Total - data.Previous.Conversations?.Total)/data.Previous.Conversations?.Total) * 100 : (data.Current.Conversations?.Total) * 100;
      
      this.data.Percent= {
        Message: percentMessage.toFixed(0),
        Comment: percentComment.toFixed(0),
        Conversation: percentConversation.toFixed(0)
      };
    } else {
      this.data.Percent = {
        Message: 0,
        Comment: 0,
        Conversation: 0
      }
    }
  }

  loadAxisData(data: SummaryDailyDTO) {
    let messageData = data.Current?.Messages?.Data;
    let maxTime = messageData[messageData.length - 1]?.Time;
    let maxHour = new Date(maxTime).getUTCHours();
    maxHour = Number(maxHour) + 1;
    this.axisData = [];

    for (let i = 0; i <= maxHour; i++) {
      this.axisData = [...this.axisData, [i]];
    }
  }

  loadSeriesData(data: SummaryDailyDTO) {
    let lstMessages: number[] = [];
    let lstConversations: number[] = [];

    let lstTotalMessage = data.Current.Messages?.Data?.map((f:any) => { return f.MessageCount + f.CommentCount }) || [];
    let lstTotalConversation = data.Current.Conversations?.Data?.map((f:any) => { return f.Count }) || [];
    //TODO: lấy 5 giá trị trên trục y
    let calInterval = Math.max(...lstTotalMessage,...lstTotalConversation) / 5;
    this.interval = Math.ceil(calInterval / 100) * 100;
    
    this.axisData.forEach((hour) => {
      let findMessage = data.Current.Messages?.Data?.find((x:any) => new Date(x.Time).getUTCHours() === Number(hour));
      if(findMessage){
        lstMessages.push(findMessage.MessageCount + findMessage.CommentCount);
      }else{
        lstMessages.push(0);
      }

      let findConversation = data.Current.Conversations?.Data?.find((x:any) => new Date(x.Time).getUTCHours() === Number(hour));
      if(findConversation){
        lstConversations.push(findConversation?.Count);
      }else{
        lstConversations.push(0);
      }
    });

    this.seriesData = [
      {
        name: 'Tin nhắn và bình luận',
        data: lstMessages
      },
      {
        name: 'Hội thoại',
        data: lstConversations
      },
    ];
  }

  loadDataChart(){
    if(TDSHelperArray.hasListValue(this.axisData) && TDSHelperArray.hasListValue(this.seriesData)){
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
                        '<span class="text-neutral-1-500 text-caption-2 font-regular font-sans text-center pb-2">' +
                          formatDate(new Date().toUTCString(), 'EEEE', 'vi-VN')
                          + ', {b}:00 ' + 
                          formatDate(new Date().toUTCString(), 'dd/MM/yyyy', 'vi-VN') 
                          + '</span><br>'+
                        '<div class="flex flex-row items-center justify-between gap-x-5 text-white text-caption-2 font-semibold font-sans text-center">'+
                          '<span>{c} {a}</span>'+
                          '<span>{c1} {a1}</span>'+
                        '</div>'+
                      '</div>'+
                    '</div>',
          borderColor:'transparent',
          backgroundColor:'rgba(0, 0, 0, 0.8)'
        },
        grid:{
          top: 16,
          right: 8,
          bottom: 70
        },
        legend:{
          show: true,
          bottom: 0,
          icon: 'roundRect'
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
              max: this.interval*5,
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

    } else {
      this.emptyData = true;
    }
  }

  buildChartDemo(chart : TDSLineChartComponent ){
    this.dailyOption = this.chartOption.LineChartOption(chart);
    this.dailyOption.xAxis[0].axisLabel.showMinLabel = true;
  }

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSLineChartDataSeries[] = [];
    seriesData.forEach((series, i) => {
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
              colorStops: [
                {
                  offset: 0, 
                  color: this.colors[i].toString()
                }, 
                {
                  offset: 1, 
                  color: '#FFF'
                }
              ],
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
    this.loadSummaryCurrentDay();
  }
}
