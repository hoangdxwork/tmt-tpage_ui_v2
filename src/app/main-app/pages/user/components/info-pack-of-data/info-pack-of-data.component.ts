import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs';
import { CRMTeamService } from './../../../../services/crm-team.service';

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
  lstTeam: CRMTeamDTO[] = [];

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

  constructor(private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {}

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

    this.loadListTeam();
  }

  loadListTeam() {
    this.isLoading = true;
    this.crmTeamService.getAllFacebooks().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
          this.lstTeam = res;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
      }
    })
  }

  buildData(used: TenantUsedDTO) {
    this.saleOrderCount = used?.saleOnlineOrder || 0;
    this.tenantLimitedCount = this.tenantInfo?.Limitations?.FastSaleOrder || 0;

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
