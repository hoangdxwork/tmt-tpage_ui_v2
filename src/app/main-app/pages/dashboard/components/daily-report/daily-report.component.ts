import { Color } from 'echarts';
import { formatPercent } from '@angular/common';
import { TDSChartOptions, TDSLineChartComponent } from 'tds-report';
import { TDSSafeAny, vi_VN } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  //#region variable
  dailyOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  showData = true;
  currentFilter = 'Tuần này';
  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  labelData:{name:string,value:number,color:string,percent:string}[]= [];
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    let axisData:TDSSafeAny[] = ['1','3','5','7','9','11','13','15','17','19','21','23']
    let seriesData:TDSSafeAny[] = [4,9,2,15,7,19,11,14,9,15,10,18];
    let colors:Color[] = ['#28A745','#1A6DE3'];

    this.labelData = [
      {
        name:'Khách hàng mới',
        value:50,
        percent:'25%',
        color:'primary-1'
      },
      {
        name:'Tin nhắn mới',
        value:20,
        percent:'25%',
        color:'secondary-1'
      },
      {
        name:'Bình luận mới',
        value:20,
        percent:'25%',
        color:'warning-400'
      }
    ]

    if(this.labelData.length == 0 || axisData.length == 0 || seriesData.length == 0){
      this.showData = false;
    }

    let chart:TDSLineChartComponent = {
      color:colors,
      grid:{
        left:'8%',
        right: 16
      },
      tooltip:{
        show:true,
        position:'top',
        trigger: 'axis',
        formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">{b}:00<span><br>{c} {a}<br> 5 bình luận<div>',
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
      axis:{
        xAxis:[
          {
            name:'Giờ',
            nameGap:12,
            nameLocation:'start',
            type:'category',
            data: axisData,
            axisTick:{
              show:true,
              alignWithLabel:true,
              inside:true,
              lineStyle:{
                color:'#E9EDF2'
              }
            },
            axisLine:{
              show:false,
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
              margin:12,
              color:'#000',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'right'
            },
            interval:10,
            splitNumber:3,
          }
        ]
      },
      series:[
        {
          name:'tin nhắn',
          type:'line',
          symbol:'circle',
          data: seriesData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart : TDSLineChartComponent ){
    this.dailyOption = this.chartOption.LineChartOption(chart);
    this.dailyOption.yAxis[0].axisLabel.showMinLabel = false;
  }
}
