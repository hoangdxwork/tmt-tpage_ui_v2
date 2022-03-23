import { Color } from 'echarts';
import { TDSSafeAny, vi_VN } from 'tmt-tang-ui';
import { TDSBarChartComponent, TDSChartOptions, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-report-conversations',
  templateUrl: './report-conversations.component.html',
  styleUrls: ['./report-conversations.component.scss']
})
export class ReportConversationsComponent implements OnInit {
  //#region variable
  option:TDSSafeAny;
  chartOption = TDSChartOptions();
  listOfData:Array<TDSSafeAny> = [];
  selectList = [
    { id:1, name:'App Quản Lí Bán Hàng TPos 1' },
    { id:2, name:'App Quản Lí Bán Hàng TPos 2' },
    { id:3, name:'App Quản Lí Bán Hàng TPos 3' },
  ];
  selectedItem = this.selectList[0].name;
  rangeDate = null;
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.listOfData = [
      {
        id:1, reportDate:'06/06/2021', conversations:50, messages:30, comments:20, newPhoneNumber:10, responseTime:10, orders:10, completeOrders:2, noReplyMessages:10
      },
      {
        id:2, reportDate:'06/06/2021', conversations:50, messages:30, comments:20, newPhoneNumber:10, responseTime:10, orders:10, completeOrders:2, noReplyMessages:10
      },
      {
        id:3, reportDate:'06/06/2021', conversations:50, messages:30, comments:20, newPhoneNumber:10, responseTime:10, orders:10, completeOrders:2, noReplyMessages:10
      },
      {
        id:4, reportDate:'06/06/2021', conversations:50, messages:30, comments:20, newPhoneNumber:10, responseTime:10, orders:10, completeOrders:2, noReplyMessages:10
      },
      {
        id:5, reportDate:'06/06/2021', conversations:50, messages:30, comments:20, newPhoneNumber:10, responseTime:10, orders:10, completeOrders:2, noReplyMessages:10
      },
    ];
    let axisData:TDSSafeAny[] = ['06/06','07/06','08/06','09/06','10/06','11/06','12/06','13/06','14/06','15/06','16/06','17/06'];
    let seriesData:TDSSafeAny[] = [
      {
        name:'Tin nhắn',
        data:[1500,2500,2400,1100,1500,2020,850,1950,1650,2450,1900,1900]
      },
      {
        name:'Bình luận',
        data:[1900,1300,1600,2100,900,1500,1700,2550,2200,1200,1350,950]
      }
    ];
    let colors:Color[] = ['#1A6DE3','#28A745'];

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
        formatter:function(params:any[]){
          let res = '<span class="text-black text-title-1 font-semibold font-sans pb-2">' + params[0].name + '/2021</span><br>';
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
    this.option = this.chartOption.BarChartOption(chart);
  }

  getSeries(seriesData:TDSSafeAny[]){
    let list:TDSBarChartDataSeries[] = [];
    seriesData.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'bar',
          barWidth:26,
          data: series.data
        }
      );
    });
    return list;
  }

  onChangeSelect(data:TDSSafeAny){
    this.selectedItem = data;
  }

  onChangeDate(result: Date[]): void {
    
  }
}
