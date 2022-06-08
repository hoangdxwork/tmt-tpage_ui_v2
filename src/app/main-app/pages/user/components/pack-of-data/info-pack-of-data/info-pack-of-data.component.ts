import { Component, OnInit } from '@angular/core';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';

@Component({
  selector: 'app-info-pack-of-data',
  templateUrl: './info-pack-of-data.component.html',
  styleUrls: ['./info-pack-of-data.component.scss']
})
export class InfoPackOfDataComponent implements OnInit {
  options: any;
  array = [0, 1, 2, 3]
  isIndex = -1

  size: any = ['auto', 300];

  chartOptions = TDSChartOptions();

  chartComponent: TDSBarChartComponent = {
    legend: {
      show: true,
      right: -150,
      top: 'middle',
      orient: 'vertical',
      icon: 'circle',
    },
    grid: {
      left: '20%',
      right: '20%'
    },
    color: ['#0184FF', '#FF8900'],
    axis: {
      xAxis: [
        {
          show: true,
          axisLabel: {
            show: true
          },
          axisLine: {
            show: true
          },
          interval: 500,
          splitNumber: 4
        }
      ],
      yAxis: [
        {
          data: ['1'],

        }
      ]
    },
    series: [
      {
        type: 'bar',
        name: 'Tổng hoá đơn của bạn',
        barWidth: 32,
        data: [337]
      },
      {
        type: 'bar',
        name: 'Hạn mức gói sử dụng',
        barWidth: 32,
        data: [2000]
      }
    ]
  }
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  constructor() { }

  ngOnInit(): void {
    this.options = this.chartOptions.BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }

  focusData(idx: number) {
    this.isIndex = idx
  }
  clickBackPageInfoData() {
  }
}
