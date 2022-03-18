import { Color } from 'echarts';
import { formatPercent } from '@angular/common';
import { vi_VN, TDSSafeAny } from 'tmt-tang-ui';
import { TDSChartOptions, TDSPieChartComponent, TruncateString } from 'tds-report';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-report',
  templateUrl: './staff-report.component.html',
  styleUrls: ['./staff-report.component.scss']
})
export class StaffReportComponent implements OnInit {
  //#region variable
  staffOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  showData = true;
  
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
    let staffsData:TDSSafeAny[] = [
      { id:1, name:'Nguyễn Bính', value:60 },
      { id:2, name:'Nguyễn Jolie', value:40 },
    ]

    let colors:Color[] = ['#28A745','#DBEFFF'];

    if(staffsData.length == 0){
      this.showData = false;
    }

    let chart:TDSPieChartComponent = {
      legend:{
        show:true,
        orient:'vetical',
        top:'bottom',
        itemHeight:12,
        itemWidth:12,
        itemGap:16,
        textStyle:{
          width:380,
          rich:{
            header:{
              color:'#2C333A',
              fontStyle:'normal',
              fontSize:16,
              lineHeight:24,
              fontWeigth:600,
              fontFamily:'Segoe UI',
              width:180,
              align:'left'
            },
            body:{
              color:'#929DAA',
              fontStyle:'normal',
              fontSize:14,
              lineHeight:20,
              fontWeigth:400,
              fontFamily:'Segoe UI',
              align:'left'
            },
            value:{
              color:'#2C333A',
              fontStyle:'normal',
              fontSize:16,
              lineHeight:24,
              fontWeigth:600,
              fontFamily:'Segoe UI',
              align:'right'
            },
          }
        }
      },
      color:colors,
      series:[
        {
          type:'pie',
          center:['50%','40%'],
          clockwise:false,
          startAngle:0,
          silent:true,
          avoidLabelOverlap:false,
          label:{
            show:true,
            position:'center',
            formatter: '{avatar|}\n{header|{b}}\n{body| {c} tương tác}\n{highlight|{d}%}',
            rich:{
              header:{
                color:'#2C333A',
                fontStyle:'normal',
                fontSize:16,
                lineHeight:24,
                fontWeigth:600,
                fontFamily:'Segoe UI',
                padding:8
              },
              body:{
                color:'#929DAA',
                fontStyle:'normal',
                fontSize:14,
                lineHeight:20,
                fontWeigth:400,
                fontFamily:'Segoe UI',
                align:'center'
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
                width:48,
                height:48,
                backgroundColor:{
                  image:'assets/images/Avatar-user.png'
                }
              }
            }
          },
          data: staffsData
        }
      ]
    }

    if(chart.legend){
      chart.legend.formatter = function(name:string){
        let staff = staffsData.find(s=>s.name === name) ?? { name:'', value:0 };
        let avg = staff.value/staffsData.reduce((pre,x)=> x.value + pre ,0);
        
        return '{header|' + TruncateString(name,18) + '}' + '{body|' + staff.value + ' tương tác}' + '{value|' + formatPercent(avg,vi_VN.locale,'1.0-2') + '}';
      }
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSPieChartComponent){
    this.staffOption = this.chartOption.DonutChartOption(chart,139,90);
    this.staffOption.series[0].legendHoverLink = false;
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
