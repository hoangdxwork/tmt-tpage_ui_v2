import { Color } from 'echarts';
import { formatDate } from '@angular/common';
import { TDSChartOptions, TDSBarChartDataSeries, TDSBarChartComponent } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrls: ['./report-articles.component.scss']
})
export class ReportArticlesComponent implements OnInit {
  //#region variable
  option:TDSSafeAny;
  chartOption = TDSChartOptions();
  tableData:Array<TDSSafeAny> = [];
  selectList = [
    { id:1, name:'App Quản Lí Bán Hàng TPos 1' },
    { id:2, name:'App Quản Lí Bán Hàng TPos 2' },
    { id:3, name:'App Quản Lí Bán Hàng TPos 3' },
  ];
  selectedItem = this.selectList[0].name;
  pageData:TDSSafeAny[] = [];
  rangeDate = null;
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.pageData = [
      { id: 1, name:'Bài viết', value:10 },
      { id: 2, name:'Bình luận', value:200 },
      { id: 3, name:'Lượt thích', value:100 },
      { id: 4, name:'Đơn hàng', value:200 },
    ];

    this.tableData = [
      {
        id:1, reportDate:'06/06/2021', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:2, reportDate:'06/06/2021', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:3, reportDate:'06/06/2021', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:4, reportDate:'06/06/2021', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:5, reportDate:'06/06/2021', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
    ];
    let axisData:TDSSafeAny[] = ['06/06','07/06','08/06','09/06','10/06','11/06'];
    let seriesData:TDSSafeAny[] = [
      {
        name:'Bài viết 1',
        data:[1000,1300,900,1100,700,660]
      },
      {
        name:'Bài viết 2',
        data:[780,850,960,1055,770,950]
      },
      {
        name:'Bài viết 3',
        data:[500,330,440,356,477,990]
      }
    ];
    let colors:Color[] = ['#1A6DE3','#28A745','#F59E0B'];

    let component:TDSBarChartComponent = {
      color: colors,
      legend:{
        show:true,
        right:-240,
        bottom:-8,
        itemHeight:16,
        itemWidth:24,
        itemGap:-224,
      },
      grid:{
        left:'5%',
        right:8,
        top:8
      },
      tooltip:{
        show:true,
        position:'top',
        formatter:function(params:TDSSafeAny[]){
          let res = '';
          params.forEach(item => {
            res += '<span class="text-black text-body-2 font-semibold font-sans">'+item.seriesName+'</span>'+
                    '<br>'+item.marker+'<span class="text-neutral-1-700 text-body-2 font-regular font-sans">'+item.value+'</span><br>';
          });
          return res
        },
        trigger:'axis',
        axisPointer:{
          type:'shadow'
        },
      },
      axis:{
        xAxis:[
          {
            axisTick:{
              show:false
            },
            axisLabel:{
              margin:16
            },
            axisLine:{
              show:false
            },
            data:axisData
          }
        ],
        yAxis:[
          {
            interval:500,
            axisLabel:{
              margin:24,
              align:'right'
            }
          }
        ]
      },
      series:this.getSeries(seriesData)
    }

    this.buildChart(component);
  }

  buildChart(chart:TDSBarChartComponent){
    this.option = this.chartOption.BarChartOption(chart,true);
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

  onChangeSelect(data:any){
    this.selectedItem = data;
  }

  onChangeDate(result: Date[]): void {

  }
}
