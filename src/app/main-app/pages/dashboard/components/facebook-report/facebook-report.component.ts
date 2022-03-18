import { Color } from 'echarts';
import { TDSSafeAny, vi_VN } from 'tmt-tang-ui';
import { TDSBarChartComponent, TDSChartOptions, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-facebook-report',
  templateUrl: './facebook-report.component.html',
  styleUrls: ['./facebook-report.component.scss']
})
export class FacebookReportComponent implements OnInit {

  //#region  variable
  fbReportOption:TDSSafeAny;
  chartOption = TDSChartOptions();
  showData = true;

  pageList = [
    {id:1, name:'Quần áo XK Nhiên Nhiên'},
  ]
  currentPage = this.pageList[0].name;

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;

  labelData:{name:string,value:number}[]= [];
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = [
      {
        name:'Tổng lượt thích',
        value:65000
      },
      {
        name:'Tổng bình luận',
        value:500
      },
      {
        name:'Tổng tin nhắn',
        value:65000
      },
      {
        name:'Tổng bài viết',
        value:20
      },
      {
        name:'Khách hàng mới',
        value:20
      }
    ];

    let axisData:TDSSafeAny[] = ['20/7','21/7','22/7','23/7','24/7','25/7','26/7'];
    let seriesData:TDSSafeAny[] = [
      {
        name:'Tin nhắn',
        data:[250,190,145,250,150,150,285]
      },
      {
        name:'Bình luận',
        data:[140,285,190,290,180,180,145]
      }
    ];
    let colors:Color[] = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    if(axisData.length == 0 || seriesData.length == 0){
      this.showData = false;
    }

    let chart:TDSBarChartComponent ={
      color:colors,
      legend:{
        show:true,
        orient:'vertical',
        bottom:60,
        right:-140,
        itemHeight:12,
        itemWidth:12,
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
        formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">{b}/2020<span><br>{c} {a}<div>',
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
        right:'20%'
      },
      axis:{
        xAxis:[
          {
            data: axisData,
            axisTick:{
              show:false
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
              margin:24,
              color:'#000',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              align:'right'
            },
            interval:100
          }
        ]
      },
      series: this.getSeries(seriesData)
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
          barWidth:24,
          data: series.data
        }
      );
    });
    return list;
  }

  formatValue(value:number){
    if(value > 1000000000){
      return formatNumber(value/1000000000,vi_VN.locale,'1.0-2') +' B';
    }
    if(value > 1000000){
      return formatNumber(value/1000000,vi_VN.locale,'1.0-2') +' M';
    }
    if(value > 1000){
      return formatNumber(value/1000,vi_VN.locale,'1.0-2') +' K';
    }else{
      return value;
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }

  onChangePage(data:any){
    this.currentPage = data;
  }
}
