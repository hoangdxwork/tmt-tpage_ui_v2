import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-facebook',
  templateUrl: './report-facebook.component.html',
  styleUrls: ['./report-facebook.component.scss']
})
export class ReportFacebookComponent implements OnInit {
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
        id:1, page:'App Quản Lí Bán Hàng Tpos', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:2, page:'App Quản Lí Bán Hàng Tpos', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:3, page:'App Quản Lí Bán Hàng Tpos', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:4, page:'App Quản Lí Bán Hàng Tpos', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:5, page:'App Quản Lí Bán Hàng Tpos', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
    ];
    let axisData:TDSSafeAny[] = ['06/06','07/06','08/06','09/06','10/06','11/06'];
    let seriesData:TDSSafeAny[] = [
      {
        name:'Page 1',
        data:[1000,1300,900,1100,700,660]
      },
      {
        name:'Page 2',
        data:[780,850,960,1055,770,250]
      },
      {
        name:'Page 3',
        data:[500,330,440,356,477,490]
      },
      {
        name:'Page 4',
        data:[450,310,260,125,566,381]
      }
    ];
    let colors:Color[] = ['#1A6DE3','#28A745','#F59E0B','#0C9AB2'];

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
