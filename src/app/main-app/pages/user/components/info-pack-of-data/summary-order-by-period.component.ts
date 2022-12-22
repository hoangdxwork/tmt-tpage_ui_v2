import { TenantService } from 'src/app/main-app/services/tenant.service';
import { takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { formatDate } from '@angular/common';
import { SummaryOrderDTO } from '../../../../dto/dashboard/summary-order.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { EventSummaryService } from '../../../../services/event-summary.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { TDSChartOptions, TDSLineChartComponent } from 'tds-report';
import { TenantInfoDTO } from 'src/app/main-app/dto/tenant/tenant.dto';

@Component({
  selector: 'summary-order-by-period',
  templateUrl: './summary-order-by-period.component.html',
  providers: [TDSDestroyService]
})
export class SummaryOrderByPeriodComponent implements OnInit, AfterViewInit {

  options: any;
  size: any = ['auto', 440];

  axisPreviousData: Date[] = [];
  axisCurrentData: Date[] = [];
  sumOrder!: SummaryOrderDTO;
  sumPrevious: number = 0;
  sumCurrent: number = 0;

  chartOptions = TDSChartOptions();

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
  isLoading: boolean = false;

  constructor(private eventSummaryService: EventSummaryService,
    private tenantService: TenantService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    
  }

  loadData() {
    // code mẫu xóa sau khi có dữ liệu
    this.sumOrder = {...this.test};
    this.sumPrevious = this.sumOrder.Previous.Items.reduce((x,pre) => x + pre?.Count, 0) || 0;
    this.sumCurrent = this.sumOrder.Current.Items.reduce((x,cur) => x + cur?.Count, 0) || 0;
    
    this.isLoading = false;
    this.buildData();
    this.buildSummaryOrderChart();
    //

    this.isLoading = true;
    this.tenantService.getInfo().subscribe({
      next: (res) => {
        if(!res || !res?.Tenant || !res?.Tenant?.DateExpired) return;
    
        let until = new Date(res.Tenant.DateExpired);
        let since = new Date(res.Tenant.DateExpired);
        since = new Date(since.setDate(since.getDate() - 30));

        this.eventSummaryService.getSummaryOrderByPeriod(since, until).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:any) => {
            if(res?.Previous?.Items && res?.Current?.Items){

              this.sumOrder = {...this.test};
              this.sumPrevious = this.sumOrder.Previous.Items.reduce((x,pre) => x + pre.Count, 0);
              this.sumCurrent = this.sumOrder.Current.Items.reduce((x,cur) => x + cur.Count, 0);

              this.buildData();
              this.buildSummaryOrderChart();

              this.isLoading = false;
            }

            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.message.error(err.error?.message || 'Không thể tải dữ liệu thống kê đơn hàng');
          }
        })
      }, 
      error: (error) => {
        this.isLoading = false;
        this.message.error(error?.error?.message);
      }
    });
  }

  buildData() {
    let currentDates = this.sumOrder.Current?.Items?.map(x => Number(formatDate(x.Time,'dd','vi_VN')));
    let previousDates = this.sumOrder.Previous?.Items?.map(x => Number(formatDate(x.Time,'dd','vi_VN')));

    if(currentDates.length > 0 && previousDates.length > 0) {
      let start = currentDates[0] < previousDates[0] ? currentDates[0] : previousDates[0];
      let end = currentDates[currentDates.length - 1] > previousDates[previousDates.length - 1] ? currentDates[currentDates.length - 1] : previousDates[previousDates.length - 1];
      
      // check giá trị đầu
      if(start < currentDates[0]) {
        let first = new Date(this.sumOrder.Current?.Items?.[0].Time);

        while(currentDates[0] - start > 0) {
          this.sumOrder.Current.Items.unshift({
            Time: new Date(first.setDate(first.getDate() - 1)),
            Count: 0
          })

          start++;
        }
      }

      if(start < previousDates[0]) {
        let first = new Date(this.sumOrder.Previous?.Items?.[0].Time);

        while(previousDates[0] - start > 0) {
          this.sumOrder.Previous.Items.unshift({
            Time: new Date(first.setDate(first.getDate() - 1)),
            Count: 0
          })

          start++;
        }
      }

      // check giá trị cuối
      let previousLength = this.sumOrder.Previous.Items.length;
      let currentLength = this.sumOrder.Current.Items.length;

      while(previousLength - currentLength > 0) {
        let last = new Date(this.sumOrder.Current.Items[currentLength - 1].Time);

        this.sumOrder.Current.Items.push({
          Time: new Date(last.setDate(last.getDate() + 1)),
          Count: 0
        })

        currentLength++;
      }
    }
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
      grid:{
        left: '5%',
        right: 0
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
              interval: 0
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
              interval: 0
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
          name: 'Đơn hàng tháng trước',
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: this.sumOrder.Previous?.Items?.map(x => { return x.Count }) || []
        },
        {
          name: 'Đơn hàng tháng hiện tại',
          type: 'line',
          xAxisIndex: 1,
          emphasis: {
            focus: 'series'
          },
          data: this.sumOrder.Current?.Items?.map(x => { return x.Count }) || []
        },
      ]
    }

    this.options = this.chartOptions.LineChartOption(chartComponent);
    this.isLoading = false;
  }
}
