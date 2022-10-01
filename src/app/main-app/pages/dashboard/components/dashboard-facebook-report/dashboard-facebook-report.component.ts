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
  seriesData: TDSSafeAny[] = [];
  colors: Color[] = [];
  xAxisName: string = 'Ngày';
  isLoading: boolean = false;

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
      next:(res:SummaryDailyDTO) => {
        if(res && res?.Current){
          this.data = {...res};
          this.handlerAxisData(res);
          this.handlerSeriesData(res);
          this.loadDataChart();
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
    let lstDataMesage = data.Current?.Messages?.Data || [];

    //TODO: trường hợp hôm nay + hôm qua
    let exist1 = this.currentDateRanges.id == 0 || this.currentDateRanges.id == 1;
    // TODO: trường hợp 7 ngày + 30 ngày
    let exist2 = this.currentDateRanges.id == 7|| this.currentDateRanges.id == 30;
    
    if(exist1) {
      this.xAxisName = 'Giờ';

      lstDataMesage.map((x)=>{
        if(x.Time){
          this.axisData.push(new Date(x.Time).getUTCHours());
        }
      })
    } 
    
    if(exist2){
      this.xAxisName = 'Ngày';

      lstDataMesage.map((x) => {
        if(!this.axisData.includes(new Date(x.Time).getUTCDate())){
          this.axisData.push(new Date(x.Time).getUTCDate());
        }
      })
    }
  }

  handlerSeriesData(data: SummaryDailyDTO) {
    let lstDataMesage = data.Current?.Messages?.Data || [];
    let lstDataConversation = data.Current?.Conversations?.Data || [];
    let lstMessage: number[] = [];
    let lstConversation: number[] = [];
    //TODO: trường hợp hôm nay + hôm qua
    let exist1 = this.currentDateRanges.id == 0 || this.currentDateRanges.id == 1;
    // TODO: trường hợp 7 ngày + 30 ngày
    let exist2 = this.currentDateRanges.id == 7|| this.currentDateRanges.id == 30;
    
    if(exist1) {
      this.axisData.map((x) => {
        let find = lstDataMesage.find(f => Number(new Date(f.Time).getUTCHours()) == Number(x));
        if(find){
          lstMessage.push(find.CommentCount + find.MessageCount);
        }else{
          lstMessage.push(0);
        }
      })

      this.axisData.map((x) => {
        let find = lstDataConversation.find(f => Number(new Date(f.Time).getUTCHours()) == Number(x));
        if(find){
          lstConversation.push(find.Count);
        }else{
          lstConversation.push(0);
        }
      })
    } 

    if(exist2) {
      this.axisData.map((x) => {
        let messageCount = 0;
        let conversationCount = 0;

        lstDataMesage.map(f=> {
          if(x == new Date(f.Time).getUTCDate()) {
            messageCount += (f.CommentCount + f.MessageCount);
          }
        });

        lstMessage.push(messageCount);

        lstDataConversation.map(f=> {
          if(x == new Date(f.Time).getUTCDate()) {
            conversationCount += f.Count;
          }
        });

        lstConversation.push(conversationCount);
      })
    }

    this.seriesData = [{name: 'Tin nhắn và bình luận', data: lstMessage}, { name: 'Hội thoại', data: lstConversation }];
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
          formatter: `<span class="pb-2">${this.xAxisName}: {b}</span><br>{c} {a}`,
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
          }
        },
        grid: {
          top: 24,
          left: '6%',
          right: 40,
          bottom: 80
        },
        axis: {
          xAxis:[
            {
              data: this.axisData,
              name: this.xAxisName,
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
              }
            }
          ],
          yAxis: [
            {
              splitLine:{
                
              },
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
      // chart.dataZoom = {
      //   sliderType:{
      //     show: true,
      //     type: 'slider',
      //     startValue: 0,
      //     endValue: 6,
      //     zoomLock: true,
      //     bottom: 35
      //   }
      // }

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
          barWidth: 8,//set độ rộng của các series
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
}
