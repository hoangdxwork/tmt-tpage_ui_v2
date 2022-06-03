import { formatNumber } from '@angular/common';
import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { TDSSafeAny, vi_VN, TDSHelperArray } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { InputSummaryPostDTO, InputSummaryTimelineDTO, MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO, SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard-facebook-report',
  templateUrl: './dashboard-facebook-report.component.html',
  styleUrls: ['./dashboard-facebook-report.component.scss']
})
export class DashboardFacebookReportComponent implements OnInit {
  fbReportOption:TDSSafeAny;
  chartOption = TDSChartOptions();
  labelData:TDSSafeAny[] = [];
  axisData:TDSSafeAny[] = [];
  seriesData:TDSSafeAny[] = [];
  colors:Color[] = [];

  emptyData = false;

  filterList: SummaryFilterDTO[] = [];
  currentFilter!: SummaryFilterDTO;

  dataSummaryPost!: MDBSummaryByPostDTO;
  dataCommentAndMessage: MDBTotalCommentMessageFbDTO[] = [];

  constructor(
    private summaryFacade: SummaryFacade,
    private reportFacebookService: ReportFacebookService
  ) { }

  ngOnInit(): void {
    this.loadFilter();

    this.loadSummary();
    this.loadCommentAndMessage();
  }

  loadFilter() {
    this.filterList = this.summaryFacade.getFilter();
    this.currentFilter = this.filterList[0];
  }

  loadSummary() {
    let model = {} as InputSummaryPostDTO;
    model.PageId = undefined;
    model.DateStart = this.currentFilter.startDate;
    model.DateEnd = this.currentFilter.endDate;

    this.reportFacebookService.getSummaryPost(model).subscribe(res => {
      this.dataSummaryPost = res;
    });
  }

  loadCommentAndMessage() {
    let model = {} as InputSummaryTimelineDTO;
    model.PageId = undefined;
    model.DateStart = this.currentFilter.startDate;
    model.DateEnd = this.currentFilter.endDate;

    this.reportFacebookService.getCommentAndMessage(model).subscribe(res => {
      this.dataCommentAndMessage = res;

      if(TDSHelperArray.hasListValue(res)) {
        let newArr: any[] = [];

        res.forEach((a: any) => {
          let find = newArr.find(x => x.Date == a.Date);
          if(!find) {
            newArr.push(a);
          }
        });

        this.handlerAxisData(newArr);
        this.handlerSeriesData(newArr);
        this.loadDataChart();
      }
      else {
        this.emptyData = true;
      }
    }, error => this.emptyData = true);
  }

  handlerAxisData(data: MDBTotalCommentMessageFbDTO[]) {
    this.axisData = data.map(value => format(new Date(value.Date), "dd/MM"));
  }

  handlerSeriesData(data: MDBTotalCommentMessageFbDTO[]) {
    let arrMessage = data.map(x => x.TotalMessage);
    let arrComment = data.map(x => x.TotalComment);

    this.seriesData = [{name: 'Tin nhắn', data: arrMessage}, { name: 'Bình luận', data: arrComment }];
  }

  loadDataChart(){
    this.labelData = [60000,60000,60000,60000,60000];
    this.colors = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    let chart:TDSBarChartComponent ={
      color: this.colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        top:'bottom',
        left:'right',
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
        formatter:'<span class="pb-2">{b}/2020</span><br>{c} {a}',
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
              align:'center'
            }
          }
        ],
        yAxis:[
          {
            axisLabel:{
              margin:24,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'right'
            }
          }
        ]
      },
      series: this.getSeries(this.seriesData)
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart : TDSBarChartComponent ){
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

  onChangeFilter(data:any){
    this.currentFilter = data;
    this.loadSummary();
    this.loadCommentAndMessage();
  }
}
