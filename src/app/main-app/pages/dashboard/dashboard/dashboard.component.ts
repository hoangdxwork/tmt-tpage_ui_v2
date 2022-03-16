import { vi_VN } from 'tmt-tang-ui';
import { formatPercent } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TDSBarChartComponent, TDSChartOptions, TDSLineChartComponent, TDSPieChartComponent, TruncateString } from 'tds-report';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  fbReportOption:any;
  changeRateOption:any;
  revenueOption:any;
  staffOption:any;
  dailyOption:any;
  productOption:any;

  chartOption = TDSChartOptions();

  dashboardData = true;
  facebookData = true;
  labelData = true;
  revenueData = true;
  changingData = true;
  dailyData = true;
  staffData = true;
  productData = true;
  connectPageData = true;

  currentFilter = 'Tuần này';
  currentPage = 'Quần áo XK Nhiên...';

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]

  pageList = [
    {id:1, name:'Quần áo XK Nhiên Nhiên'},
  ]

  staffsData = [
    { id:1, name:'Nguyễn Bính', value:60 },
    { id:1, name:'Nguyễn Jolie', value:40 },
  ]

  constructor() {}

  fbReportComponent:TDSBarChartComponent = {
    color:['#28A745','#1A6DE3'],
    legend:{
      show:true,
      orient:'vertical',
      bottom:60,
      right:-140,
      itemHeight:12,
      itemWidth:12,
      textStyle:{
        color:'#2C333A',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20
      }
    },
    tooltip:{
      show:true,
      position:'top',
      formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">{b}/2020<span><br>{c} {a}<div>',
      borderColor:'transparent',
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      textStyle:{
        color:'#FFF',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20,
        align:'center'
      }
    },
    grid:{
      right:'20%'
    },
    axis:{
      xAxis:[
        {
          data:['20/7','21/7','22/7','23/7','24/7','25/7','26/7'],
          axisTick:{
            show:false
          },
          axisLine:{
            show:false
          },
          axisLabel:{
            margin:16,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'center'
          }
        }
      ],
      yAxis:[
        {
          axisLabel:{
            margin:24,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'right'
          },
          interval:100
        }
      ]
    },
    series:[
      {
        name:'Tin nhắn',
        type:'bar',
        barWidth:24,
        data:[250,190,145,250,150,150,285]
      },
      {
        name:'Bình luận',
        type:'bar',
        barWidth:24,
        data:[140,285,190,290,180,180,145]
      }
    ]
  }

  changeRateComponent:TDSBarChartComponent = {
    color:['#28A745','#1A6DE3'],
    legend:{
      show:true,
      orient:'vertical',
      bottom:60,
      right:-140,
      itemWidth:12,
      itemHeight:12,
      textStyle:{
        color:'#2C333A',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20
      }
    },
    tooltip:{
      show:true,
      position:'top',
      formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">{b}/2020<span><br>{c} {a}<div>',
      borderColor:'transparent',
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      textStyle:{
        color:'#FFF',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20,
        align:'center'
      }
    },
    grid:{
      right:'20%'
    },
    axis:{
      xAxis:[
        {
          data:['20/7','21/7','22/7','23/7','24/7','25/7','26/7'],
          axisTick:{
            show:false
          },
          axisLine:{
            show:false
          },
          axisLabel:{
            margin:16,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'center'
          }
        }
      ],
      yAxis:[
        {
          axisLabel:{
            margin:24,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'right'
          },
          interval:100
        }
      ]
    },
    series:[
      {
        name:'Khách hàng mới',
        type:'bar',
        barWidth:24,
        data:[250,190,145,250,150,150,285]
      },
      {
        name:'Khách mua hàng',
        type:'bar',
        barWidth:24,
        data:[140,285,190,290,180,180,145]
      }
    ]
  }

  revenueComponent:TDSLineChartComponent = {
    color:['#28A745','#1A6DE3'],
    legend:{
      show:true,
      orient:'vertical',
      icon:'roundRect',
      bottom:60,
      right:-200,
      itemHeight:12,
      itemWidth:12,
      textStyle:{
        color:'#2C333A',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20
      }
    },
    tooltip:{
      show:true,
      position:'top',
      formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">Tháng {b}<span><br>{a} {c}<div>',
      borderColor:'transparent',
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      textStyle:{
        color:'#FFF',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20,
        align:'center'
      }
    },
    grid:{
      right:'15%'
    },
    axis:{
      xAxis:[
        {
          data:['1','2','3','4','5','6','7'],
          axisTick:{
            show:true,
            inside:true,
            alignWithLabel:true,
            lineStyle:{
              color:'#E9EDF2'
            }
          },
          axisLine:{
            show:false
          },
          axisLabel:{
            margin:16,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'center'
          }
        }
      ],
      yAxis:[
        {
          axisLabel:{
            margin:16,
            width:100,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'right'
          },
          interval:100000000,
        }
      ]
    },
    series:[
      {
        name:'Doanh thu',
        type:'line',
        symbol:'circle',
        data:[100000000,150000000,90000000,210000000,120000000,250000000,90000000]
      },
      {
        name:'Lợi nhuận',
        type:'line',
        symbol:'circle',
        data:[200000000,100000000,280000000,100000000,200000000,90000000,250000000]
      }
    ]
  }

  // 
  dailyReportComponent:TDSLineChartComponent = {
    color:['#28A745','#1A6DE3'],
    grid:{
      left:'8%',
      right: 16
    },
    tooltip:{
      show:true,
      position:'top',
      formatter:'<div class="text-white font-body-2 font-regular text-center"><span class="pb-2">{b}:00<span><br>{c} {a}<br> 5 bình luận<div>',
      borderColor:'transparent',
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      textStyle:{
        color:'#FFF',
        fontFamily:'Segoe UI',
        fontWeight:400,
        fontStyle:'normal',
        fontSize:14,
        lineHeight:20,
        align:'center'
      }
    },
    axis:{
      xAxis:[
        {
          name:'Giờ',
          nameGap:12,
          nameLocation:'start',
          type:'category',
          data:['1','3','5','7','9','11','13','15','17','19','21','23'],
          axisTick:{
            show:true,
            alignWithLabel:true,
            inside:true,
            lineStyle:{
              color:'#E9EDF2'
            }
          },
          axisLine:{
            show:false,
          },
          axisLabel:{
            margin:16,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'center'
          }
        }
      ],
      yAxis:[
        {
          axisLabel:{
            margin:12,
            color:'#000',
            fontFamily:'Segoe UI',
            fontWeight:400,
            fontStyle:'normal',
            fontSize:14,
            lineHeight:20,
            align:'right'
          },
          interval:10,
          splitNumber:3,
        }
      ]
    },
    series:[
      {
        name:'tin nhắn',
        type:'line',
        symbol:'circle',
        symbolOffset:[0,-6],
        showSymbol:false,
        symbolSize:6,
        data:[4,9,2,15,7,19,11,14,9,15,10,18]
      }
    ]
  }

  staffComponent:TDSPieChartComponent = {
    legend:{
      show:true,
      orient:'vetical',
      top:'bottom',
      itemHeight:12,
      itemWidth:12,
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
            align:'left'
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
    color:['#28A745','#DBEFFF'],
    series:[
      {
        type:'pie',
        center:['50%','40%'],
        clockwise:false,
        startAngle:0,
        silent:true,
        avoidLabelOverlap:false,
        legenHoverLink:false,
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
        data:this.staffsData
      }
    ]
  }

  data = [['[SP0557] GIẤY K80',15000],['[SP0761] Ginkgo Biloba',18000],['[SP0318] Máy in',21000],['[AZPNJ] Chỉ Vàng PNJ',23000],['[SP0557] GIẤY K80',27000],['[SP0761] Ginkgo Biloba',33000],['[SP0318] Máy in',42000],['[SJC] Vàng SJC',44000],['[SP0557] GIẤY K80',52000],['[AZ100] 100 gr Vàng SJC',58000]]

  dateList = this.data.map(function (item) {
    return item[0];
  });

  valueList = this.data.map(function (item) {
    return item[1];
  });

  productComponent:TDSBarChartComponent = {
    color:['#28A745'],
    grid:{
      top:'5%',
      left:'35%',
      right:'6%',
      bottom:'10%'
    },
    axis:{
      yAxis:[
        {
          data: this.dateList,
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
        data: this.valueList as number[]
      }
    ]
  }

  ngOnInit(): void {
    this.fbReportOption = this.chartOption.BarChartOption(this.fbReportComponent);
    this.changeRateOption = this.chartOption.BarChartOption(this.changeRateComponent);
    this.revenueOption = this.chartOption.LineChartOption(this.revenueComponent);
    this.dailyOption = this.chartOption.LineChartOption(this.dailyReportComponent);
    this.dailyOption.yAxis[0].axisLabel.showMinLabel = false;
    this.staffOption = this.customStaffChart();
    this.productOption = this.chartOption.BarChartOption(this.productComponent);
  }

  customStaffChart(){
    let staffs = this.staffsData;

    if(this.staffComponent.legend){
      this.staffComponent.legend.formatter = function(name:string){
        let staff = staffs.find(s=>s.name === name) ?? { name:'', value:0 };
        let avg = staff.value/staffs.reduce((pre,x)=> x.value + pre ,0);
        
        return '{header|' + name + '}' + '{body|' + staff.value + ' tương tác}' + '{value|' + formatPercent(avg,vi_VN.locale,'1.0-2') + '}';
      }
    }

    return this.chartOption.DonutChartOption(this.staffComponent,139,90);
  }

  onChangeFilter(data:any){
    console.log(data)
  }
}
