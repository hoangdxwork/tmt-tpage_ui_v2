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

  chartOptions = TDSChartOptions();
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
    this.isLoading = true;
    this.tenantService.getInfo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {

        if(!res || !res?.Tenant || !res?.Tenant?.DateExpired) return;
        let period = this.getPackPeriod(res?.Tenant?.DateExpired);

        this.eventSummaryService.getSummaryOrderByPeriod(period?.since, period?.until).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:any) => {
            if(res?.Previous?.Items && res?.Current?.Items){

              this.sumOrder = {...res};
              this.buildData();
              this.buildSummaryOrderChart();
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
          name: 'Đơn hàng chu kỳ trước',
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: this.sumOrder.Previous?.Items?.map(x => { return x.Count }) || []
        },
        {
          name: 'Đơn hàng chu kỳ hiện tại',
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
  }

  getPackPeriod(DateExpired: Date) {
    let period = {
      since: new Date(new Date(DateExpired).setDate(new Date(DateExpired).getDate() - 29)),
      until: new Date(DateExpired)
    }

    let dateTmp = period.since;
    let now = new Date();

    while(now <= period.since) {
      period.until = new Date(dateTmp.setDate(dateTmp.getDate() - 1));
      period.since = new Date(dateTmp.setDate(dateTmp.getDate() - 29));
      dateTmp = period.since;
    }

    return period;
  }
}
