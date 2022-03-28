import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-revenue-report',
  templateUrl: './dashboard-revenue-report.component.html',
  styleUrls: ['./dashboard-revenue-report.component.scss']
})
export class DashboardRevenueReportComponent implements OnInit {
  //#region variable
  revenueOption:TDSSafeAny;
  chartOption = TDSChartOptions();
  labelData:TDSSafeAny[] = [];
  axisData:TDSSafeAny[] = [];
  seriesData:TDSSafeAny[] = [];
  colors:Color[] = [];

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  emptyData = false;
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  
  loadData(){
    this.labelData = [
      {
        value:500000000,
        decrease:false
      },
      {
        value:200000000,
        decrease:false
      },
    ];

    this.axisData = ['1','2','3','4','5','6'];
    this.seriesData = [
      {
        name:'Lợi nhuận',
        data:[1000,1600,1100,1300,1100,1400]
      },
      {
        name:'Doanh thu',
        data:[450,400,1600,500,400,1000]
      }
    ];
    this.colors = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    if(this.labelData.length < 2 || this.seriesData.length == 0 || this.axisData.length == 0){
      this.emptyData = true;
    }

    let chart:TDSBarChartComponent ={
      color:this.colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        left:'right',
        top:'bottom',
        textStyle:{
          color:'#424752',
          fontFamily:'Segoe UI',
          fontWeight:400,
          fontStyle:'normal',
          fontSize:12,
          lineHeight:16
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
              lineStyle:{
                color:'#E9EDF2',
                width:1
              }
            },
            splitLine:{
              lineStyle:{
                color:'#E9EDF2',
                width:1
              }
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
            interval:500,
          }
        ]
      },
      series: this.getSeries(this.seriesData)
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart : TDSBarChartComponent ){
    this.revenueOption = this.chartOption.BarChartOption(chart,true);
    let seriesList = this.revenueOption.series as TDSSafeAny[];
    this.revenueOption.series[seriesList.length-1].itemStyle = {
      borderRadius:[4,4,0,0]
    };
  }

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSBarChartDataSeries[] = [];
    seriesData.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'bar',
          barWidth:24,
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
