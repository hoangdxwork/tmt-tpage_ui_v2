import { formatDate } from '@angular/common';
import { SummaryDailyDTO } from './../../../../dto/dashboard/summary-daily.dto';
import { EventSummaryService } from './../../../../services/event-summary.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { MDBTotalCommentMessageFbDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';
import { setHours } from 'date-fns';

@Component({
  selector: 'app-dashboard-facebook-report',
  templateUrl: './dashboard-facebook-report.component.html',
  providers: [TDSDestroyService]
})

export class DashboardFacebookReportComponent implements OnInit {

  fbReportOption: TDSSafeAny;
  chartOption = TDSChartOptions();
  labelData: TDSSafeAny[] = [];
  axisData: TDSSafeAny[] = [];
  axisLabel: string[] = [];
  seriesData: TDSSafeAny[] = [];
  colors: Color[] = [];
  isLoading: boolean = false;
  interval: number = 0;
  barWidth: number = 8;

  emptyData = false;

  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  data!: SummaryDailyDTO;
  dataCommentAndMessage: MDBTotalCommentMessageFbDTO[] = [];

  constructor(private commonHandler: CommonHandler,
    private eventSummaryService: EventSummaryService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
      this.tdsDateRanges = this.commonHandler.tdsDateRanges;
      this.currentDateRanges = this.commonHandler.currentDateRanges;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.eventSummaryService.getSummaryByDay(this.currentDateRanges?.id || 0).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: SummaryDailyDTO) => {
        if(res && res?.Current){
          this.data = {...res};
          this.handlerAxisData(res);
          this.handlerSeriesData(res);
          this.loadDataChart();
          this.emptyData = false;
        } else {
          this.emptyData = true;
        }

        this.isLoading = false;
      },
      error:(error) => {
        this.emptyData = true;
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  handlerAxisData(data: SummaryDailyDTO) {
    this.axisData = [];
    this.axisLabel = [];
    let lstDataMesage = data.Current?.Messages?.Data || [];

    lstDataMesage.map((x) => {
      if(x.Time){
        // TODO: lấy time bằng cách trừ timezone
        let time = new Date(x.Time);

        this.axisData = [...this.axisData,...[time]];
        this.axisLabel = [...this.axisLabel,...[formatDate(time, 'dd/MM HH:mm', 'vi_VN')]];
      }
    })

    if(this.axisLabel.length > 10){
      // TODO: nếu data ít hơn 10 cột thì hiển thị toàn bộ label trục x, ko thì cách 1 label hiển thị 1 label
      this.interval = 1;
      this.barWidth = 8;
    }else{
      this.interval = 0;
      this.barWidth = 15;
    }
    
  }

  handlerSeriesData(data: SummaryDailyDTO) {
    let lstDataMesage = data.Current?.Messages?.Data || [];
    let lstDataConversation = data.Current?.Conversations?.Data || [];
    let lstMessage: number[] = [];
    let lstComment: number[] = [];
    let lstConversation: number[] = [];
    this.seriesData = [];

    // TODO: tính message data
    this.axisData.map((x) => {
      let find = lstDataMesage.find(f => Number(new Date(f.Time)) == Number(x));
      if(find){
        lstMessage.push(find.MessageCount);
      }else{
        lstMessage.push(0);
      }
    })

    // TODO: tính comment data
    this.axisData.map((x) => {
      let find = lstDataMesage.find(f => Number(new Date(f.Time)) == Number(x));
      if(find){
        lstComment.push(find.CommentCount);
      }else{
        lstComment.push(0);
      }
    })

    // TODO: tính conversation data
    this.axisData.map((x) => {
      let find = lstDataConversation.find(f => Number(new Date(f.Time)) == Number(x));
      if(find){
        lstConversation.push(find.Count);
      }else{
        lstConversation.push(0);
      }
    })

    this.seriesData = [{ name: 'Tin nhắn', data: lstMessage }, { name: 'Bình luận', data: lstComment }, { name: 'Hội thoại', data: lstConversation }];
  }

  loadDataChart(){
    if(TDSHelperArray.hasListValue(this.axisData) && TDSHelperArray.hasListValue(this.seriesData)) {
      this.colors = ['#2C80F8','#28A745','#F59E0B','#F33240'];

      let chart: TDSBarChartComponent = {
        color: this.colors,
        legend: {
          show: true,
          itemHeight: 16,
          itemWidth: 24,
          itemGap: 16,
          left: 'right',
          top: 'bottom',
          textStyle: {
            color: '#2C333A',
            fontFamily: 'Segoe UI',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: 14,
            lineHeight: 20
          }
        },
        tooltip: {
          show: true,
          position: 'top',
          formatter: function (params: any[]) {
            let label = `<span class="pb-2">${params[0].axisValue}</span><br>`;
            params.forEach((x) => {
              label += `<div class="flex flex-col items-start">
                          <div class="flex flex-row gap-x-2">
                            <span>${x.marker}${x.value}</span>
                            <span>${x.seriesName}</span>
                          </div>
                        </div>`
            })
            return label;
          },
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          textStyle: {
            color: '#FFF',
            fontFamily: 'Segoe UI',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: 14,
            lineHeight: 20,
            align: 'center'
          },
          trigger: 'axis',
          axisPointer:{
            type: 'shadow'
          }
        },
        grid: {
          top: 24,
          left: '6%',
          right: 40,
          bottom: 84
        },
        axis: {
          xAxis:[
            {
              data: this.axisLabel,
              nameGap: 5,
              nameLocation: 'end',
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                margin: 16,
                color: '#6B7280',
                fontFamily: 'Segoe UI',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 20,
                align: 'center',
                width: 100,
                interval: this.interval,
                formatter: function (params:any) {
                  return params.replace(' ', '\n');
                }
              }
            }
          ],
          yAxis: [
            {
              axisLabel: {
                margin: 12,
                color: '#6B7280',
                fontFamily: 'Segoe UI',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 20,
                align: 'right',
                width: 100
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

  buildChartDemo(chart : TDSBarChartComponent) {
    if(Number(this.currentDateRanges.id) == 30) {
      chart.grid!.bottom = 100;
    }
    // TODO: khởi tạo chart
    this.fbReportOption = this.chartOption.BarChartOption(chart);
    let seriesList = this.fbReportOption.series as any[];
    seriesList.forEach(series => {
      series.itemStyle = {
        borderRadius:[4,4,0,0]
      };
    });
    this.fbReportOption.series = seriesList;
  }

  getSeries(seriesData:TDSSafeAny[]) {
    let list: TDSBarChartDataSeries[] = [];
    seriesData.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'bar',
          barWidth: this.barWidth,//set độ rộng của các series
          data: series.data
        }
      );
    });
    return list;
  }

  onChangeFilter(data: any){
    this.currentDateRanges = data;

    this.loadData();
  }

  onCalcPercent(data: SummaryDailyDTO, type: string) {
    let percent: number = 0;
    if(!data) {
      return percent;
    }
   
    switch(type) {
      case 'Conversations':
            if(data?.Previous?.Conversations && data?.Current?.Conversations) {
              percent = data.Previous.Conversations.Total != 0 && data.Current.Conversations.Total != 0 ? ((data.Current.Conversations.Total - data.Previous.Conversations.Total)/ data.Previous.Conversations.Total) * 100 : data.Current.Conversations.Total*100;
            } else {
              percent = 0;
            }
            
        break;
      case 'Messages':
        if(data?.Previous?.Messages && data?.Current?.Messages) {
          percent = data.Previous.Messages.MessageTotal != 0 && data.Current.Conversations.Total != 0 ? ((data.Current.Messages.MessageTotal - data.Previous.Messages.MessageTotal)/ data.Previous.Messages.MessageTotal) * 100 : data.Current.Messages.MessageTotal*100;
        } else {
          percent = 0;
        }
            
        break;
      case 'Comments':
        if(data?.Previous?.Messages && data?.Current?.Messages) {
          percent = data.Previous.Messages.CommentTotal != 0 && data.Current.Conversations.Total != 0 ? ((data.Current.Messages.CommentTotal - data.Previous.Messages.CommentTotal)/ data.Previous.Messages.CommentTotal) * 100 : data.Current.Messages.CommentTotal*100;
        } else {
          percent = 0;
        }
            
        break;
    }

    return percent;
  }
}