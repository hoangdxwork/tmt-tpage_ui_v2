import { Color } from 'echarts';
import { TDSChartOptions, TDSPieChartComponent } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-staffs',
  templateUrl: './report-staffs.component.html',
  styleUrls: ['./report-staffs.component.scss']
})
export class ReportStaffsComponent implements OnInit {
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
        id:1, name:'Nguyễn Bính', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:2, name:'Hoàng Minh', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:3, name:'Lê Hương', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:4, name:'Lý Phát', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
      {
        id:5, name:'Hồ Ca', imageURL:'assets/images/Avatar-user.png', conversations:30, messages:20, comments:50, customers:50, oldCustomers:30, orders:40, completeOrders:20, responseTime:10, revenue:5000000
      },
    ];

    let seriesData:TDSSafeAny[] = [
      {
        name:'Nguyễn Bính',
        value:80
      },
      {
        name:'Hoàng Minh',
        value:30
      },
      {
        name:'Lê Hương',
        value:80
      },
      {
        name:'Lý Phát',
        value:30
      },
      {
        name:'Hồ Ca',
        value:30
      }
    ];
    let colors:Color[] = ['#2684FF','#28A745','#FF8900','#0C9AB2','#FFC400'];

    let component:TDSPieChartComponent = {
      color: colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        top:'bottom',
        width: 1800,
        itemGap:-150,
        left:'20%'
      },
      tooltip:{
        show:true,
        position:'right',
        borderColor:'#FFF',
        formatter:function(params:TDSSafeAny){
          return '<span class="text-neutral-1-900 text-body-2 font-semibold font-sans">'+params.name+'</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tương tác</span><span class="text-neutral-1-900 pl-4 text-body-2 font-semibold font-sans">'+params.value+' tương tác</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tỉ lệ</span><span class="text-neutral-1-900 pl-14 text-body-2 font-semibold font-sans">'+params.percent+'%</span>'
        }
      },
      series:[
        {
          type:'pie',
          center:['50%','40%'],
          data:seriesData,
          avoidLabelOverlap:false,
          label:{
            show:false,
            position:'center',
            rich: {
              header:{
                color:'#2C333A',
                fontStyle:'normal',
                fontSize:16,
                lineHeight:24,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'left',
                padding:[0,0,0,12]
              },
              body:{
                color:'#929DAA',
                fontStyle:'normal',
                fontSize:14,
                lineHeight:20,
                fontWeigth:400,
                fontFamily:'Segoe UI',
                align:'left',
                padding:[0,0,0,64]
              },
              highlight:{
                color:'#1A6DE3',
                fontStyle:'normal',
                fontSize:40,
                lineHeight:53.2 ,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'center',
                padding:[0,0,12,0]
              },
              avatar:{
                width:48,
                height:48,
                backgroundColor:{
                  image:'assets/images/Avatar-user.png'
                }
              }
            }
          },
        }
      ]
    }

    if(component.series[0].label){
      component.series[0].label.formatter = function(params:TDSSafeAny){
        return '{highlight|'+params.percent+'%}\n{avatar|}{header|'+params.name+'}\n{body| '+params.value+' tương tác}'
      }
    }

    this.buildChart(component);
  }

  buildChart(chart:TDSPieChartComponent){
    this.option = this.chartOption.DonutChartOption(chart,150,120);
    this.option.series[0].LegendHoverLink = false;
  }

  onChangeSelect(data:any){
    this.selectedItem = data;
  }

  onChangeDate(result: Date[]): void {

  }
}
