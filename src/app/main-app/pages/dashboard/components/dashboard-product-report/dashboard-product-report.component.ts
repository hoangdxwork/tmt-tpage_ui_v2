import { Color } from 'echarts';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-product-report',
  templateUrl: './dashboard-product-report.component.html'
})
export class DashboardProductReportComponent implements OnInit {
  //#region variable
  productOption:TDSSafeAny;
  chartOption = TDSChartOptions();
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
    this.axisData = ['[SP0557] GIẤY K80','[SP0761] Ginkgo Biloba','[SP0318] Máy in','[AZPNJ] Chỉ Vàng PNJ','[SP0557] GIẤY K80','[SP0761] Ginkgo Biloba','[SP0318] Máy in','[SJC] Vàng SJC','[SP0557] GIẤY K80','[AZ100] 100 gr Vàng SJC'];
    this.seriesData = [15000,18000,21000,23000,27000,33000,42000,44000,52000,58000];
    this.colors = ['#28A745','rgba(40, 167, 69, 0.1)'];

    if(this.axisData.length == 0 || this.seriesData.length == 0){
      this.emptyData = true;
    }

    let chart:TDSBarChartComponent = {
      grid:{
        top:'5%',
        left:'35%',
        right:'6%',
        bottom:'10%'
      },
      axis:{
        yAxis:[
          {
            data: this.axisData,
            axisLabel:{
              margin:16,
              width:155,
              color:'#929DAA',
              fontFamily:'Segoe UI',
              fontStyle:'normal',
              fontSize:14,
              fontWeight:400,
              lineHeight:20,
              align:'right'
            },
            axisTick:{
              show:false
            },
            axisLine:{
              show:false
            }
          }
        ],
        xAxis:[
          {
            axisLabel:{
              interval:0,
              color:'#929DAA',
              fontFamily:'Segoe UI',
              fontStyle:'normal',
              fontSize:14,
              fontWeight:400,
              lineHeight:20,
              align:'center',
              width:50
            },
          }
        ]
      },
      series:[
        {
          name:'',
          type:'bar',
          barWidth: 20,
          barCategoryGap:'40%',
          itemStyle:{
            borderRadius:2
          },
          data: this.seriesData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSBarChartComponent){
    let visualMap = [
      {
        show: false,
        type: 'continuous',
        color: this.colors,
        min: 0,
        max: this.seriesData.length - 1
      }
    ]
    this.productOption = this.chartOption.BarChartOption(chart);
    this.productOption.visualMap = visualMap;
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
