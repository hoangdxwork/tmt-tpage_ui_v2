import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs';
import { formatDate } from '@angular/common';
import { SummaryOrderDTO } from './../../../../dto/dashboard/summary-order.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { EventSummaryService } from './../../../../services/event-summary.service';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { TDSChartOptions, TDSBarChartComponent, TDSLineChartComponent } from 'tds-report';
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
  orderOptions: any;
  array = [0, 1, 2, 3];
  isIndex = -1;

  size: any = ['auto', 300];
  orderSize: any = ['auto', 440];

  labelData: TDSSafeAny[] = [];
  axisPreviousData: Date[] = [];
  axisCurrentData: Date[] = [];

  seriesData: TDSSafeAny[] = [];
  sumOrder!: SummaryOrderDTO;
  emptyData = false;

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

  //Dữ liệu mẫu
  test:any = {
    "Current": {
      "Total": 16543,
      "Items": [
        {
          "Time": "2022-12-11T07:00:00+07:00",
          "Count": 33
        },
        {
          "Time": "2022-12-12T07:00:00+07:00",
          "Count": 2815
        },
        {
          "Time": "2022-12-13T07:00:00+07:00",
          "Count": 2255
        },
        {
          "Time": "2022-12-14T07:00:00+07:00",
          "Count": 3304
        },
        {
          "Time": "2022-12-15T07:00:00+07:00",
          "Count": 2717
        },
        {
          "Time": "2022-12-16T07:00:00+07:00",
          "Count": 1132
        },
        {
          "Time": "2022-12-17T07:00:00+07:00",
          "Count": 1934
        },
        {
          "Time": "2022-12-18T07:00:00+07:00",
          "Count": 205
        },
        {
          "Time": "2022-12-19T07:00:00+07:00",
          "Count": 2148
        }
      ]
    },
    "Previous": {
      "Total": 68234,
      "Items": [
        {
          "Time": "2022-11-13T07:00:00+07:00",
          "Count": 248
        },
        {
          "Time": "2022-11-14T07:00:00+07:00",
          "Count": 2649
        },
        {
          "Time": "2022-11-15T07:00:00+07:00",
          "Count": 2445
        },
        {
          "Time": "2022-11-16T07:00:00+07:00",
          "Count": 2280
        },
        {
          "Time": "2022-11-17T07:00:00+07:00",
          "Count": 2473
        },
        {
          "Time": "2022-11-18T07:00:00+07:00",
          "Count": 867
        },
        {
          "Time": "2022-11-19T07:00:00+07:00",
          "Count": 2024
        },
        {
          "Time": "2022-11-20T07:00:00+07:00",
          "Count": 2506
        },
        {
          "Time": "2022-11-21T07:00:00+07:00",
          "Count": 1392
        },
        {
          "Time": "2022-11-22T07:00:00+07:00",
          "Count": 2265
        },
        {
          "Time": "2022-11-23T07:00:00+07:00",
          "Count": 1613
        },
        {
          "Time": "2022-11-24T07:00:00+07:00",
          "Count": 2457
        },
        {
          "Time": "2022-11-25T07:00:00+07:00",
          "Count": 1898
        },
        {
          "Time": "2022-11-26T07:00:00+07:00",
          "Count": 3144
        },
        {
          "Time": "2022-11-27T07:00:00+07:00",
          "Count": 2286
        },
        {
          "Time": "2022-11-28T07:00:00+07:00",
          "Count": 3025
        },
        {
          "Time": "2022-11-29T07:00:00+07:00",
          "Count": 2537
        },
        {
          "Time": "2022-11-30T07:00:00+07:00",
          "Count": 1478
        },
        {
          "Time": "2022-12-01T07:00:00+07:00",
          "Count": 1283
        },
        {
          "Time": "2022-12-02T07:00:00+07:00",
          "Count": 2471
        },
        {
          "Time": "2022-12-03T07:00:00+07:00",
          "Count": 2811
        },
        {
          "Time": "2022-12-04T07:00:00+07:00",
          "Count": 3278
        },
        {
          "Time": "2022-12-05T07:00:00+07:00",
          "Count": 3736
        },
        {
          "Time": "2022-12-06T07:00:00+07:00",
          "Count": 3506
        },
        {
          "Time": "2022-12-07T07:00:00+07:00",
          "Count": 2659
        },
        {
          "Time": "2022-12-08T07:00:00+07:00",
          "Count": 3056
        },
        {
          "Time": "2022-12-09T07:00:00+07:00",
          "Count": 2147
        },
        {
          "Time": "2022-12-10T07:00:00+07:00",
          "Count": 3226
        },
        {
          "Time": "2022-12-11T07:00:00+07:00",
          "Count": 2474
        }
      ]
    }
  }

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() userTime: TDSSafeAny;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();

  isLoading: boolean = false;
  currentTab: PackOfDataEnum = PackOfDataEnum.INFO;

  constructor(private eventSummaryService: EventSummaryService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.tenantInfo && this.tenantUsed) {
      this.uploadChart(this.tenantUsed);
    }
  }

  ngOnInit(): void {
    this.options = this.chartOptions.BarChartOption(this.chartComponent);
    this.loadData();
  }

  loadData() {
    // code mẫu xóa sau khi có dữ liệu
    this.sumOrder = {...this.test};
              
    this.emptyData = false;
    this.isLoading = false;
    this.buildSummaryOrderChart();
    // 

        // if(!this.tenantInfo?.Tenant || !this.tenantInfo.Tenant.DateExpired) return;

        // let until = new Date(this.tenantInfo.Tenant.DateExpired);
        // let since = new Date(this.tenantInfo.Tenant.DateExpired);
        // since = new Date(since.setDate(since.getDate() - 30));

        // this.eventSummaryService.getSummaryOrderByPeriod(since, until).pipe(takeUntil(this.destroy$)).subscribe({
        //   next: (res) => {
        //     if(res?.Previous && res?.Current){
        //       this.emptyData = false;
    
        //       this.sumOrder = {...this.test};
              
        //       this.emptyData = false;
        //       this.isLoading = false;
        //       this.buildSummaryOrderChart();
        //     } else {
        //       this.emptyData = true;
        //     }
    
        //     this.isLoading = false;
        //   },
        //   error: (err) => {
        //     this.emptyData = true;
        //     this.isLoading = false;
        //     this.message.error(err.error?.message || 'Đã xảy ra lỗi');
        //   }
        // })
  }

  buildSummaryOrderChart() {
    let chartComponent: TDSLineChartComponent = {
      color: ['#0184FF', '#FF8900'],
      legend: {
        show: true,
        right: 0,
        top: 'bottom',
        orient: 'horizontal',
        icon: 'circle',
      },
      tooltip: {
        axisPointer: {
          type: 'cross'
        }
      },
      axis:{
        xAxis: [
          {
            type: 'category',
            axisLabel:{
              interval: this.sumOrder.Previous?.Items?.length > 10 ? 3 : 0
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false
            },
            data: this.sumOrder.Previous?.Items?.map(x => formatDate(x.Time, 'dd/MM', 'vi_VN'))
          },
          {
            type: 'category',
            axisLabel:{
              interval: this.sumOrder.Current?.Items?.length > 10 ? 3 : 0
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false
            },
            data: this.sumOrder.Current?.Items?.map(x => formatDate(x.Time, 'dd/MM', 'vi_VN'))
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: true
            },
            axisTick:{
              show: true
            },
            axisLabel:{
              margin: 32
            }
          }
        ]
      },
      series: [
        {
          name: 'Tháng trước',
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: this.sumOrder.Previous?.Items?.map(x => { return x.Count }) || []
        },
        {
          name: 'Tháng hiện tại',
          type: 'line',
          xAxisIndex: 1,
          emphasis: {
            focus: 'series'
          },
          data: this.sumOrder.Current?.Items?.map(x => { return x.Count }) || []
        },
      ]
    }

    this.orderOptions = this.chartOptions.LineChartOption(chartComponent);
    this.isLoading = false;
  }

  uploadChart(used: TenantUsedDTO) {
    this.chartComponent.series[0].data[0] = used.saleOnlineOrder;
    this.chartComponent.series[1].data[1] = this.tenantInfo.Limitations.FastSaleOrder;
    this.options = this.chartOptions.BarChartOption(this.chartComponent);
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
