import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-facebook-report',
  templateUrl: './dashboard-facebook-report.component.html',
  styleUrls: ['./dashboard-facebook-report.component.scss']
})
export class DashboardFacebookReportComponent implements OnInit {
  //#region variable
  fbReportOption:TDSSafeAny;
  chartOption = TDSChartOptions();
  labelData:TDSSafeAny;
  axisData:TDSSafeAny[] = [];
  seriesData:TDSSafeAny[] = [];
  colors:Color[] = [];

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = {
      likes:60000,
      comments:60000,
      messages:60000,
      articles:60000,
      conversations:60000
    };

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

    let chart:TDSBarChartComponent ={
      color:this.colors,
      legend:{
        show:true,
        bottom:0,
        right:-240,
        itemHeight:16,
        itemWidth:24,
        itemGap:-220,
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
        top:16,
        left:'6%',
        right:0
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

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
