import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-report-facebook',
  templateUrl: './report-facebook.component.html',
  styleUrls: ['./report-facebook.component.scss']
})
export class ReportFacebookComponent implements OnInit {
  //#region variable
  option:TDSSafeAny;
  chartOption = TDSChartOptions();
  tableData:Array<TDSSafeAny> = [];
  axisData:TDSSafeAny[] = [];
  seriesData:TDSSafeAny[] = [];
  colors:Color[] = [];

  selectList = [
    { id:1, name:'App Quản Lí Bán Hàng TPos 1' },
    { id:2, name:'App Quản Lí Bán Hàng TPos 2' },
    { id:3, name:'App Quản Lí Bán Hàng TPos 3' },
  ];
  selectedItem = this.selectList[0].name;
  rangeDate = null;
  emptyData = false;
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.tableData = [
      {
        id:1,
        page:'App Quản Lí Bán Hàng Tpos',
        imageURL:'../../../assets/imagesv2/Avatar-user.png',
        conversations:30,
         messages:20,
         comments:50,
         customers:50,
         oldCustomers:30,
         orders:40,
         completeOrders:20,
         responseTime:10,
         revenue:5000000
      },
      {
        id:2,
        page:'App Quản Lí Bán Hàng Tpos',
        imageURL:'../../../assets/imagesv2/Avatar-user.png',
        conversations:30,
         messages:20,
         comments:50,
         customers:50,
         oldCustomers:30,
         orders:40,
         completeOrders:20,
         responseTime:10,
         revenue:5000000
      },
      {
        id:3,
        page:'App Quản Lí Bán Hàng Tpos',
        imageURL:'../../../assets/imagesv2/Avatar-user.png',
        conversations:30,
         messages:20,
         comments:50,
         customers:50,
         oldCustomers:30,
         orders:40,
         completeOrders:20,
         responseTime:10,
         revenue:5000000
      },
      {
        id:4,
        page:'App Quản Lí Bán Hàng Tpos',
        imageURL:'../../../assets/imagesv2/Avatar-user.png',
        conversations:30,
         messages:20,
         comments:50,
         customers:50,
         oldCustomers:30,
         orders:40,
         completeOrders:20,
         responseTime:10,
         revenue:5000000
      },
      {
        id:5,
        page:'App Quản Lí Bán Hàng Tpos',
        imageURL:'../../../assets/imagesv2/Avatar-user.png',
        conversations:30,
         messages:20,
         comments:50,
         customers:50,
         oldCustomers:30,
         orders:40,
         completeOrders:20,
         responseTime:10,
         revenue:5000000
      },
    ];
    this.axisData = ['06/06','07/06','08/06','09/06','10/06','11/06'];
    this.seriesData = [
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
    this.colors = ['#1A6DE3','#28A745','#F59E0B','#0C9AB2'];

    if(this.axisData.length == 0 || this.seriesData.length == 0){
      this.emptyData = true;
    }

    let component:TDSBarChartComponent = {
      color: this.colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        bottom:0,
        left:'right',
        textStyle:{
          color:'#424752',
          fontFamily:'Segoe UI',
          fontSize:12,
          fontStyle:'normal',
          lineHeight:16,
          fontWeight:400,
          align:'center'
        }
      },
      grid:{
        left:'5%',
        right:8,
        top:8,
        bottom:86
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
              margin:16,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontSize:14,
              lineHeight:20,
              fontStyle:'normal',
              align:'center'
            },
            axisLine:{
              show:false
            },
            data:this.axisData
          }
        ],
        yAxis:[
          {
            interval:500,
            axisLabel:{
              margin:24,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontSize:14,
              lineHeight:20,
              fontStyle:'normal',
              align:'right'
            }
          }
        ]
      },
      series:this.getSeries(this.seriesData)
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
