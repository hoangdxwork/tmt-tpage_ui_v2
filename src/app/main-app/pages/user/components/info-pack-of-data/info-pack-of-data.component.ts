import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'info-pack-of-data',
  templateUrl: './info-pack-of-data.component.html'
})
export class InfoPackOfDataComponent implements OnInit, OnChanges {
  options: any;
  array = [0, 1, 2, 3]
  isIndex = -1

  size: any = ['auto', 300];

  chartOptions = TDSChartOptions();

  chartComponent: TDSBarChartComponent = {
    legend: {
      show: true,
      right: 0,
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
          axisLabel: {
            margin: 45,
            width: 180,
           },
          data: ['Đơn hàng'],
        }
      ]
    },
    series: [
      {
        type: 'bar',
        name: 'Tổng đơn hàng của bạn',
        barWidth: 32,
        data: [ 0 ]
      },
      {
        type: 'bar',
        name: 'Hạn mức gói sử dụng',
        barWidth: 32,
        data: [ 0 ]
      },
    ]
  }
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() userTime: TDSSafeAny;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();

  isLoading: boolean = false;
  currentTab: PackOfDataEnum = PackOfDataEnum.INFO;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.tenantInfo && this.tenantUsed) {
      this.uploadChart(this.tenantUsed);
    }
  }

  ngOnInit(): void {
    this.options = this.chartOptions.BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }

  uploadChart(used: TenantUsedDTO) {
    this.chartComponent.series[0].data[0] = used.saleOnlineOrder;
    this.chartComponent.series[1].data[1] = this.tenantInfo.Limitations.FastSaleOrder;
    this.options = this.chartOptions.BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
    // console.log(this.options);

  }

  onExpand() {
    this.eventChangeTab.emit(PackOfDataEnum.EXPAND);
  }

  onChoose() {
    this.eventChangeTab.emit(PackOfDataEnum.CHOOSE);
  }

  focusData(idx: number) {
    this.isIndex = idx
  }

  clickBackPageInfoData() {
  }

}
