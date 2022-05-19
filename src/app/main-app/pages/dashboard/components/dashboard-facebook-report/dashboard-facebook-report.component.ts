import { formatNumber } from '@angular/common';
import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { TDSSafeAny, vi_VN } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { InputSummaryPostDTO, MDBSummaryByPostDTO, SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';

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

  constructor(
    private summaryFacade: SummaryFacade,
    private reportFacebookService: ReportFacebookService
  ) { }

  ngOnInit(): void {
    this.loadFilter();
    this.loadData();
  }

  loadFilter() {
    this.filterList = this.summaryFacade.getFilter();
    this.currentFilter = this.filterList[0];
  }

  loadData(){
    let model = {} as InputSummaryPostDTO;
    model.PageId = undefined;
    model.DateStart = this.currentFilter.startDate;
    model.DateEnd = this.currentFilter.endDate;

    this.reportFacebookService.getSummaryPost(model).subscribe(res => {
      this.dataSummaryPost = res;
    });

    this.labelData = [60000,60000,60000,60000,60000];

    this.axisData = ['06/06','07/06','08/06','09/06','10/06','11/06','12/06'];
    this.seriesData = [
      {
        name:'Tin nhắn',
        data:[1500,2510,2400,1100,1500,2000,900]
      },
      {
        name:'Bình luận',
        data:[1900,1200,1600,2100,900,1500,1800]
      }
    ];
    this.colors = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    if(this.labelData.length < 5 || this.axisData.length == 0 || this.seriesData.length == 0){
      this.emptyData = true;
    }

    let chart:TDSBarChartComponent ={
      color:this.colors,
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
            },
            interval:500
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
          barWidth:34,
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
    this.loadData();
  }
}
