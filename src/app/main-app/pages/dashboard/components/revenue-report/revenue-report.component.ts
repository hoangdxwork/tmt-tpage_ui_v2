import { Color } from 'echarts';
import { TDSLineChartComponent, TDSChartOptions, TDSLineChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.scss']
})
export class RevenueReportComponent implements OnInit {
  //#region variable
  revenueOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  showData = true;

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;

  labelData:{name:string,value:number,color:string}[] = [];
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    let axisData:TDSSafeAny[] = ['1','2','3','4','5','6','7'];
    let seriesData:TDSSafeAny[] = [
      {
        name:'Doanh thu',
        data:[100000000,150000000,90000000,210000000,120000000,250000000,90000000]
      },
      {
        name:'Lợi nhuận',
        data:[200000000,100000000,280000000,100000000,200000000,90000000,250000000]
      }
    ];
    let selectedLegend:TDSSafeAny = {
      'Doanh thu':true,
      'Lợi nhuận':false
    }
    let interval:number = 100000000;
    let colors:Color[] = ['#28A745','#1A6DE3','#F59E0B','#F33240'];
    this.labelData = [
      {
        name:'Tổng doanh thu',
        value: 500000000,
        color: 'primary-1'
      },
      {
        name:'Tổng doanh thu',
        value: 200000000,
        color: 'secondary-1'
      }
    ]

    if(this.labelData.length == 0 || axisData.length == 0 || seriesData.length == 0){
      this.showData = false;
    }

    let chart:TDSLineChartComponent = {
      color:colors,
      legend:{
        show:true,
        orient:'vertical',
        icon:'roundRect',
        bottom:60,
        right:-200,
        itemHeight:12,
        itemWidth:12,
        textStyle:{
          color:'#2C333A',
          fontFamily:'Segoe UI',
          fontWeight:400,
          fontStyle:'normal',
          fontSize:14,
          lineHeight:20
        },
        selected: selectedLegend
      },
      tooltip:{
        show:true,
        position:'top',
        formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">Tháng {b}<span><br>{a} {c}<div>',
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
        right:'15%'
      },
      axis:{
        xAxis:[
          {
            data: axisData,
            axisTick:{
              show:true,
              inside:true,
              alignWithLabel:true,
              lineStyle:{
                color:'#E9EDF2'
              }
            },
            axisLine:{
              show:false
            },
            axisLabel:{
              margin:16,
              color:'#000',
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
              margin:16,
              width:100,
              color:'#000',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'right'
            },
            interval: interval,
            splitNumber:3
          }
        ]
      },
      series: this.getSeries(seriesData)
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSLineChartComponent){
    this.revenueOption = this.chartOption.LineChartOption(chart);
  }

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSLineChartDataSeries[] = [];
        seriesData.forEach(series => {
          list.push(
            {
              name: series.name,
              type:'line',
              symbol:'circle',
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
