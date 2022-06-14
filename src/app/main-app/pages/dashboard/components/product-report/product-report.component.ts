import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { Color } from 'echarts';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {
  //#region variable
  productOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  showData= true;

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
    let axisData:TDSSafeAny[] = ['[SP0557] GIẤY K80','[SP0761] Ginkgo Biloba','[SP0318] Máy in','[AZPNJ] Chỉ Vàng PNJ','[SP0557] GIẤY K80','[SP0761] Ginkgo Biloba','[SP0318] Máy in','[SJC] Vàng SJC','[SP0557] GIẤY K80','[AZ100] 100 gr Vàng SJC'];
    let seriesData:TDSSafeAny[] = [15000,18000,21000,23000,27000,33000,42000,44000,52000,58000];
    let colors:Color[] = ['#28A745','#1A6DE3','#F59E0B','#F33240'];

    if(axisData.length == 0 || seriesData.length == 0){
      this.showData = false;
    }

    let chart:TDSBarChartComponent = {
      color:colors,
      grid:{
        top:'5%',
        left:'35%',
        right:'6%',
        bottom:'10%'
      },
      axis:{
        yAxis:[
          {
            data: axisData,
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
          data: seriesData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSBarChartComponent){
    this.productOption = this.chartOption.BarChartOption(chart);
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
