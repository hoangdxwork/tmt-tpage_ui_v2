import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { InputSummaryTimelineDTO, MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { format } from 'date-fns';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';
import { compareAsc } from 'date-fns/esm';

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

  isLoading: boolean = false;

  emptyData = false;

  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  dataSummaryPost!: MDBSummaryByPostDTO;
  dataCommentAndMessage: MDBTotalCommentMessageFbDTO[] = [];

  constructor(private commonHandler: CommonHandler,
    private reportFacebookService: ReportFacebookService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
        this.tdsDateRanges = this.commonHandler.tdsDateRanges;
        this.arangeDate(this.commonHandler.currentDateRanges);
  }

  ngOnInit(): void {
    let model = {
      DateStart: this.currentDateRanges.startDate,
      DateEnd: this.currentDateRanges.endDate
    } as InputSummaryTimelineDTO;

    this.loadSummary(model);
    this.loadCommentAndMessage(model);
  }

  loadSummary(model: InputSummaryTimelineDTO) {
    this.reportFacebookService.getSummaryPost(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.dataSummaryPost = {...res};
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  loadCommentAndMessage(model: InputSummaryTimelineDTO) {
    this.isLoading = true;

    this.reportFacebookService.getCommentAndMessage(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.dataCommentAndMessage = [...res];
  
        if(TDSHelperArray.hasListValue(res)) {
          let data: MDBTotalCommentMessageFbDTO[] = [];

          this.dataCommentAndMessage.map(x => {
            let find = data?.find(a => a?.Date && x.Date && a?.Date == x?.Date);
            if(!find) {
              data.push(x);
            }
          });
          
          this.handlerAxisData(data);
          this.handlerSeriesData(data);
          this.loadDataChart();
          this.isLoading = false;
        }
        else {
          this.emptyData = true;
          this.isLoading = false;
        }
      }, 
      error:(error) => {
        this.emptyData = true;
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  handlerAxisData(data: MDBTotalCommentMessageFbDTO[]) {
    this.axisData = [];
    let arrDate:Array<Date> = [];
    
    data.map(value => {
      if(Number(this.currentDateRanges.id) == 30){
        let day = format(new Date(value.Date), "dd");
        
        if(Number(day) % 3 == 0){
          arrDate.push(new Date(value.Date));
        }
      } else {
        arrDate.push(new Date(value.Date));
      }
    });
    
    arrDate.sort((a,b) => {
      return a.getTime() - b.getTime()
    });

    this.axisData = arrDate.map(date=> { return format(date, "dd/MM")})
  }

  handlerSeriesData(data: MDBTotalCommentMessageFbDTO[]) {
    let lstMessage = data.map(x => x.TotalMessage);
    let lstComment = data.map(x => x.TotalComment);

    this.seriesData = [{name: 'Hội thoại', data: lstMessage}, { name: 'Bài viết', data: lstComment }];
  }

  loadDataChart(){
    this.colors = ['#2C80F8','#28A745','#F59E0B','#F33240'];

    let chart: TDSBarChartComponent = {
      color: this.colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        left:'right',
        top:'bottom',
        textStyle:{
          color:'#2C333A',
          fontFamily:'Segoe UI',
          fontWeight:400,
          fontStyle:'normal',
          fontSize:14,
          lineHeight:20
        }
      },
      tooltip:{
        show:true,
        position:'top',
        formatter:'<span class="pb-2">{b}</span><br>{c} {a}',
        borderColor:'transparent',
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        textStyle:{
          color:'#FFF',
          fontFamily:'Segoe UI',
          fontWeight:400,
          fontStyle:'normal',
          fontSize:14,
          lineHeight:20,
          align:'center'
        }
      },
      grid:{
        top:24,
        left:'6%',
        right:0,
        bottom:86
      },
      axis:{
        xAxis:[
          {
            data: this.axisData,
            axisTick:{
              show:false
            },
            axisLine:{
              show:false
            },
            axisLabel:{
              margin:16,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'center',
              width: 100,
              hideOverlap: true,
            }
          }
        ],
        yAxis:[
          {
            axisLabel:{
              margin:12,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'right',
              width:100
            }
          }
        ]
      },
      series: this.getSeries(this.seriesData)
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart : TDSBarChartComponent){
    if(Number(this.currentDateRanges.id) == 30){
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

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSBarChartDataSeries[] = [];
    seriesData.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'bar',
          barWidth: 15,//set độ rộng của các series
          data: series.data
        }
      );
    });
    return list;
  }

  formatValue(value:number | undefined){
    if(!value) return 0;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  onChangeFilter(data: any){
    this.currentDateRanges = data;
    let model = {
      DateStart: this.currentDateRanges.startDate,
      DateEnd: this.currentDateRanges.endDate
    } as InputSummaryTimelineDTO;

    this.loadSummary(model);
    this.loadCommentAndMessage(model);
  }

  arangeDate(data: any){
    this.currentDateRanges = {
      id: data?.id,
      name: data?.name,
      startDate: data?.startDate,
      endDate: data?.endDate
    } as TDSDateRangeDTO;

    let checkList = [1,2];

    if(data?.startDate && !checkList.includes(this.currentDateRanges?.id)){
      let setDate = data.startDate.setDate(data.startDate.getDate() + 1);
      let formatDate = new Date(setDate).setHours(0, 0, 0, 0);
      this.currentDateRanges.startDate = new Date(formatDate);
    }

    // if(data?.endDate && this.currentDateRanges?.id == 2){
    //   let setDate = data.endDate.setDate(data.endDate.getDate() - 1);
    //   let formatDate = new Date(setDate).setHours(23, 59, 59, 0);
    //   this.currentDateRanges.endDate = new Date(formatDate);
    // }
  }
}
