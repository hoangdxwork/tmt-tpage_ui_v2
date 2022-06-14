import { Color, number } from 'echarts';
import { TDSChartOptions, TDSBarChartDataSeries, TDSBarChartComponent, TDSPieChartComponent, TDSMultiChartComponent, TDSLineChartComponent, TDSLineChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrls: ['./report-articles.component.scss']
})
export class ReportArticlesComponent implements OnInit {
  //#region variable
  option:TDSSafeAny;
  pieOption:TDSSafeAny;
  chartOption = TDSChartOptions();
  tableData:Array<TDSSafeAny> = [];
  pageData:TDSSafeAny[] = [];
  axisData:TDSSafeAny[] = [];
  barSeriesData:TDSSafeAny[] = [];
  lineSeriesData:TDSSafeAny[] = [];
  pieSeriesData:TDSSafeAny[] = [];
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
    this.pageData = [
      { id: 1, name:'Bài viết', value:10 },
      { id: 2, name:'Chia sẻ', value:200 },
      { id: 3, name:'Lượt thích', value:100 },
      { id: 4, name:'Đơn hàng', value:200 },
    ];

    this.tableData = [
      {
        id:1, reportDate:'06/06/2021', title:'Hàng công nghệ xả kho giá sốc hàng công nghệ xả...', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:2, reportDate:'06/06/2021', title:'Hàng công nghệ xả kho giá sốc hàng công nghệ xả...', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:3, reportDate:'06/06/2021', title:'Hàng công nghệ xả kho giá sốc hàng công nghệ xả...', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:4, reportDate:'06/06/2021', title:'Hàng công nghệ xả kho giá sốc hàng công nghệ xả...', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
      {
        id:5, reportDate:'06/06/2021', title:'Hàng công nghệ xả kho giá sốc hàng công nghệ xả...', likes:50, views:30, shares:20, comments:10, completeOrders:10
      },
    ];
    this.axisData = ['06/06','07/06','08/06','09/06','10/06','11/06','12/06'];
    this.barSeriesData = [
      {
        name:'Bài viết',
        data:[30,20,55,33,21,11,31]
      },
    ];
    this.lineSeriesData = [
      {
        name:'Tương tác',
        data:[9,11,18,22,14,18,17]
      },
    ]
    this.pieSeriesData = [
      {
        name:'Văn bản',
        value:30
      },
      {
        name:'Hình ảnh',
        value:30
      },
      {
        name:'Liên kết',
        value:30
      },
      {
        name:'Video',
        value:10
      },
    ]
    this.colors = ['#1A6DE3','#28A745','#F59E0B'];

    if(this.tableData.length == 0 || this.axisData.length == 0 || this.barSeriesData.length == 0 || this.lineSeriesData.length == 0 || this.pageData.length == 0){
      this.emptyData = true;
    }

    let multiComponent:TDSBarChartComponent = {
      title:{
        text:'Thống kê số lượng bài viết và lượt tương tác',
        textStyle:{
          color:'#6B7280',
          fontFamily:'Segoe UI',
          fontStyle:'normal',
          fontWeight:600,
          fontSize:18,
          lineHeight:28,
          align:'left',
          width:600
        }
      },
      color: this.colors,
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        left:'center',
        top:'bottom',
        textStyle:{
          color:'#424752',
          fontFamily:'Segoe UI',
          fontSize:12,
          fontStyle:'normal',
          lineHeight:16,
          fontWeight:400,
          align:'center'
        },
        icon:'roundRect'
      },
      grid:{
        left:'5%',
        right:'10%',
        top:'12%'
      },
      tooltip:{
        show:true,
        position:'top',
        trigger:'axis',
        axisPointer:{
          type:'none',
          z:30
        },
        formatter:function(params:TDSSafeAny[]){
          let res = '<span class="text-black text-title-1 font-semibold font-sans pb-2">' + params[0].name + '</span><br>';
          params.forEach(item => {
            res += '<span class="text-black text-body-2 font-semibold font-sans">'+item.seriesName+'</span>'+
                    '<br>'+item.marker+'<span class="text-neutral-1-700 text-body-2 font-regular font-sans">'+item.value+'</span><br>';
          });
          return res
        },
      },
      axis:{
        xAxis:[
          {
            position:'bottom',
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
              show:false,
            },
            data: this.axisData
          },
          {
            show:false,
            position:'top',
            // boundaryGap:false,
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
              show:false,
            },
            data: this.axisData
          }
        ],
        yAxis:[
          {
            position:'left',
            axisLabel:{
              margin:24,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontSize:14,
              lineHeight:20,
              fontStyle:'normal',
              align:'right'
            },
          },
          {
            position:'right',
            axisLabel:{
              margin:24,
              color:'#6B7280',
              fontFamily:'Segoe UI',
              fontWeight:400,
              fontSize:14,
              lineHeight:20,
              fontStyle:'normal',
              align:'left',
            },
            splitLine:{
              show:false
            },
          }
        ]
      },
      series:this.getSeries(this.barSeriesData,this.lineSeriesData)
    }

    let pieComponent:TDSPieChartComponent = {
      title:{
        text:'Thống kê loại bài viết',
        left:'5%',
        textStyle:{
          color:'#6B7280',
          fontFamily:'Segoe UI',
          fontStyle:'normal',
          fontWeight:600,
          fontSize:18,
          lineHeight:28,
          align:'left',
          width:600
        }
      },
      color: ['#2684FF','#28A745','#FF8900','#FFC400'],
      legend:{
        show:true,
        itemHeight:16,
        itemWidth:24,
        itemGap:16,
        top:'bottom',
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
      tooltip:{
        show:true,
        position:'right',
        borderColor:'#FFF',
        formatter:function(params:TDSSafeAny){
          return '<span class="text-neutral-1-900 text-body-2 font-semibold font-sans">Loại bài viết</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">'+params.name+'</span><span class="text-neutral-1-900 pl-4 text-body-2 font-semibold font-sans">'+params.value+'</span><br>'
            +'<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tỉ lệ</span><span class="text-neutral-1-900 pl-10 text-body-2 font-semibold font-sans">'+params.percent+'%</span>'
        }
      },
      series:[
        {
          type:'pie',
          center:['40%','50%'],
          data: this.pieSeriesData,
          avoidLabelOverlap:false,
          label:{
            show:true,
            position:'center',
            padding:[65,65],
            backgroundColor:'#F6FBFF',
            borderRadius:999,
            rich: {
              header:{
                color:'#2C333A',
                fontStyle:'normal',
                fontSize:28,
                lineHeight:37.24,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'center',
              },
              highlight:{
                color:'#1A6DE3',
                fontStyle:'normal',
                fontSize:40,
                lineHeight:53.2 ,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'center',
              },
            }
          },
          emphasis:{
            scale:false
          },
        }
      ]
    }

    if(pieComponent.series[0].label){
      pieComponent.series[0].label.formatter = function(params:TDSSafeAny){
        return '{highlight|'+params.percent+'%}\n{header|'+params.name+'}';
      }
    }

    this.buildChart(multiComponent,pieComponent);
  }

  buildChart(multiChart:TDSMultiChartComponent, pieChart:TDSPieChartComponent){
    this.option = this.chartOption.MultiChartOption(multiChart);
    this.pieOption = this.chartOption.DonutChartOption(pieChart,150,120);
  }

  getSeries(barSeries:TDSSafeAny[],lineSeries:TDSSafeAny[]){
    let list:TDSSafeAny[] = [];
    barSeries.forEach(series => {
      list.push(
        {
          name: series.name,
          type:'bar',
          barWidth:24,
          z:20,
          yAxisIndex:0,
          xAxisIndex:0,
          data: series.data
        }
      );
    });

    list.push(
      {
        name: lineSeries[0].name,
        type:'line',
        smooth:true,
        showSymbol:false,
        symbolSize:12,
        yAxisIndex:1,
        xAxisIndex:1,
        areaStyle:{
          opacity:0.2,
          color:{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#28A745'
            }, {
                offset: 1, color: '#FFF'
            }],
            global: false
          }
        },
        data: lineSeries[0].data
      }
    );
    return list;
  }

  onChangeSelect(data:any){
    this.selectedItem = data;
  }

  onChangeDate(result: Date[]): void {

  }
}
