import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'info-pack-of-data',
  templateUrl: './info-pack-of-data.component.html',
  providers: [TDSDestroyService]
})
export class InfoPackOfDataComponent implements OnInit, OnChanges {
  options: any;
  array = [0, 1, 2, 3];
  isIndex = -1;

  size: any = ['auto', 300];
  labelData: TDSSafeAny[] = [];
  seriesData: TDSSafeAny[] = [];

  chartOptions = TDSChartOptions();

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() userTime: TDSSafeAny;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();

  isLoading: boolean = false;
  currentTab: PackOfDataEnum = PackOfDataEnum.INFO;
  saleOrderCount: number = 0;
  tenantLimitedCount: number = 0;
  interval: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["tenantUsed"] && !changes["tenantUsed"].firstChange) {
      this.buildData(this.tenantUsed)
      this.buildChart();
    }
  }

  ngOnInit(): void {
    if(this.tenantInfo && this.tenantUsed) {
      this.buildData(this.tenantUsed);
      this.buildChart();
    }
  }

  buildData(used: TenantUsedDTO) {
    this.saleOrderCount = used.saleOnlineOrder;
    this.tenantLimitedCount = this.tenantInfo.Limitations.FastSaleOrder;

    let max = Math.max(...[this.saleOrderCount,this.tenantLimitedCount]);
    this.interval = this.getInterval(max);
  }

  buildChart() {
    let chartComponent: TDSBarChartComponent = {
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
            interval: this.interval,
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
          data: [ this.saleOrderCount ]
        },
        {
          type: 'bar',
          name: 'Hạn mức gói sử dụng',
          barWidth: 32,
          data: [ this.tenantLimitedCount ]
        },
      ]
    }

    this.options = this.chartOptions.BarChartOption(chartComponent);
  }

  onExpand() {
    this.eventChangeTab.emit(PackOfDataEnum.EXPAND);
  }

  onChoose() {
    this.eventChangeTab.emit(PackOfDataEnum.CHOOSE);
  }

  focusData(idx: number) {
    this.isIndex = idx;
  }

  clickBackPageInfoData() {
  }

  getInterval(maxSeriesValue: number){
    // TODO: lấy 5 khoảng thời gian giữa 2 mốc trên trục
    let interval = this.prepareInterval(maxSeriesValue/5);

    return interval;
  }

  prepareInterval(interval: number){
    let i = 10;
    while((interval/i) > 10) {
      i *= 10;
    }

    return Math.ceil(interval / i) * i;
  }
}
