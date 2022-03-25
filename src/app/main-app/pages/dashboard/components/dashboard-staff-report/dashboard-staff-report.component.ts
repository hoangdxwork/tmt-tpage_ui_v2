import { Color } from 'echarts';
import { TDSPieChartComponent, TDSChartOptions } from 'tds-report';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-staff-report',
  templateUrl: './dashboard-staff-report.component.html',
  styleUrls: ['./dashboard-staff-report.component.scss']
})
export class DashboardStaffReportComponent implements OnInit {
  //#region variable
  staffOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  labelData:TDSSafeAny;
  colors:Color[] = [];
  staffsData:TDSSafeAny[] = [];
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.staffsData = [
      { id:1, name:'Nguyễn Bính', value:70 },
      { id:2, name:'Nguyễn Thuần', value:15 },
      { id:3, name:'Nguyễn jolie', value:15 },
    ]

    this.colors= ['#28A745','#2684FF','#FF8900'];

    let chart:TDSPieChartComponent = {
      color:this.colors,
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
          center:['52%','52%'],
          clockwise:false,
          startAngle:90,
          width:260,
          height:260,
          label:{
            show:true,
            position:'center',
            padding:[40,24],
            backgroundColor:'#F2FCF5',
            borderRadius:999,
            formatter: '{highlight|{d}%}\n{avatar|}{header|{b}}\n{body| {c} tương tác}',
            rich:{
              header:{
                color:'#2C333A',
                fontStyle:'normal',
                fontSize:16,
                lineHeight:24,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                padding:[-14,0,0,12],
              },
              body:{
                color:'#929DAA',
                fontStyle:'normal',
                fontSize:14,
                lineHeight:20,
                fontWeigth:400,
                fontFamily:'Segoe UI',
                padding:[-28,0,0,32],
              },
              highlight:{
                color:'#28A745',
                fontStyle:'normal',
                fontSize:40,
                lineHeight:53.2 ,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                align:'center'
              },
              avatar:{
                width:36,
                height:36,
                backgroundColor:{
                  image:'assets/images/Avatar-user.png'
                }
              }
            }
          },
          emphasis:{
            scale:false
          },
          itemStyle:{
            borderWidth:2,
            borderColor:'#fff',
          },
          data: this.staffsData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSPieChartComponent){
    this.staffOption = this.chartOption.DonutChartOption(chart,130,102);
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
