import { takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { formatDate } from '@angular/common';
import { SummaryOrderDTO } from '../../../../dto/dashboard/summary-order.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { EventSummaryService } from '../../../../services/event-summary.service';
import { Component, OnInit } from '@angular/core';
import { TDSChartOptions, TDSLineChartComponent } from 'tds-report';

@Component({
  selector: 'summary-order-by-period',
  templateUrl: './summary-order-by-period.component.html',
  providers: [TDSDestroyService]
})
export class SummaryOrderByPeriodComponent implements OnInit {

  options: any;
  size: any = ['auto', 440];

  axisPreviousData: Date[] = [];
  axisCurrentData: Date[] = [];

  axisData: number[] = [];
  currentData: any[] = [];
  previousData: any[] = [];
  currentMonth!: number;
  previousMonth!: number;
  interval: number = 0;
  sumOrder!: SummaryOrderDTO;

  chartOptions = TDSChartOptions();
  isLoading: boolean = false;

  constructor(private eventSummaryService: EventSummaryService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    let period = this.getPackPeriod();

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
  }

  buildData() {
    this.axisData = [];
    this.previousData = [];
    this.currentData = [];

    this.currentMonth = new Date().getMonth() + 1;
    this.previousMonth = new Date().getMonth();

    let currentItems = this.sumOrder?.Current?.Items?.filter(x => this.currentMonth == (new Date(x.Time).getMonth() + 1));
    let previousItems = this.sumOrder?.Previous?.Items?.filter(x => this.previousMonth == (new Date(x.Time).getMonth() + 1));
    // bổ sung các ngày còn thiếu trong danh sách
    currentItems = this.converseList(currentItems);
    previousItems = this.converseList(previousItems);

    for (let i = 1; i <= 31; i++) {
      let existCurrent = currentItems.find(x => Number(formatDate(x.Time,'dd','vi_VN')) == i);
      let existPrevious = previousItems.find(x => Number(formatDate(x.Time,'dd','vi_VN')) == i);

      if(existCurrent || existPrevious) {
        // khởi tạo data axis
        this.axisData.push(i);
        // khởi tạo data series
        if(existCurrent) {
          this.currentData.push(existCurrent.Count);
        } else {
          this.currentData.push(undefined);
        }
  
        if(existPrevious) {
          this.previousData.push(existPrevious.Count);
        } else {
          this.previousData.push(undefined);
        }
      }
    }

    //Tính interval
    let previousCount = previousItems.map(x => x.Count);
    let currentCount = currentItems.map(x => x.Count);

    let max = Math.max(...previousCount,...currentCount);
    this.interval = this.getInterval(max);
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
        trigger: 'axis',
        axisPointer: {
          type: 'line'
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
            data: this.axisData.map(x => { return `${x}/${this.previousMonth}` })
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
            data: this.axisData.map(x => { return `${x}/${this.currentMonth}` })
          }
        ],
        yAxis: [
          {
            type: 'value',
            interval: this.interval,
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
          name: `Đơn hàng gói trước`,
          type: 'line',
          xAxisIndex: 0,
          emphasis: {
            focus: 'series'
          },
          data: this.previousData || []
        },
        {
          name: `Đơn hàng gói hiện tại`,
          type: 'line',
          xAxisIndex: 1,
          emphasis: {
            focus: 'series'
          },
          data: this.currentData || []
        },
      ]
    }

    this.options = this.chartOptions.LineChartOption(chartComponent);
  }

  getPackPeriod() {
    let since = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let until = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    // let period = {
    //   since: new Date(new Date(dateExpired).setDate(new Date(dateExpired).getDate() - 29)),
    //   until: new Date(dateExpired)
    // }

    // let dateTmp = period.since;
    // let now = new Date();

    // while(now <= period.since) {
    //   period.until = new Date(dateTmp.setDate(dateTmp.getDate() - 1));
    //   period.since = new Date(dateTmp.setDate(dateTmp.getDate() - 29));
    //   dateTmp = period.since;
    // }
    let period = {
      since: since,
      until: until
    }

    return period;
  }

  converseList(items: any[]) {
    let lstItems: any[] = [];

    let firstItem = new Date(items[0].Time).getDate();
    let lastItem = new Date(items[items.length - 1].Time).getDate();
    let previousDate = new Date(items[0].Time);

    for (let i = firstItem; i <= lastItem; i++) {
      let exist = items.find(x => new Date(x.Time).getDate() == i);

      if(exist) {
        previousDate = new Date(exist.Time);
        lstItems.push(exist);
      } else {
        // Thêm các ngày còn thiếu
        lstItems.push({
          Time: new Date(previousDate.setDate(previousDate.getDate() + 1)),
          Count: 0
        })
      }
    }

    return lstItems;
  }

  getInterval(maxSeriesValue: number){
    // TODO: lấy 7 khoảng thời gian giữa 2 mốc trên trục
    let interval = this.prepareInterval(maxSeriesValue/7);

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
