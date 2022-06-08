import { TDSSafeAny } from 'tmt-tang-ui';
import { TDSMessageService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { TenantService } from 'src/app/main-app/services/tenant.service';
import { TDSChartOptions, TDSBarChartComponent } from 'tds-report';
import { TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { DateHelperV2 } from 'src/app/main-app/shared/helper/date.helper';

@Component({
  selector: 'app-info-pack-of-data',
  templateUrl: './info-pack-of-data.component.html',
  styleUrls: ['./info-pack-of-data.component.scss']
})
export class InfoPackOfDataComponent implements OnInit {
  options: any;

  size: any = ['auto', 300];

  chartOptions = TDSChartOptions();

  chartComponent: TDSBarChartComponent = {
    legend:{
      show:true,
      right:-150,
      top:'middle',
      orient:'vertical',
      icon:'circle',
    },
    grid:{
      left:'20%',
      right:'20%'
    },
    color:['#0184FF','#FF8900'],
    axis: {
      xAxis:[
        {
          show:true,
          axisLabel:{
            show:true
          },
          axisLine:{
            show:true
          },
          interval:500,
          splitNumber:4
        }
      ],
      yAxis:[
        {
          data:[ '1'],

        }
      ]
    },
    series: [
      {
        type: 'bar',
        name: 'Tổng hoá đơn của bạn',
        barWidth:32,
        data: [ 0 ]
      },
      {
        type: 'bar',
        name: 'Hạn mức gói sử dụng',
        barWidth:32,
        data: [ 0 ]
      }
    ]
  }
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  isLoading: boolean = false;
  tenantInfo!: TenantInfoDTO;
  tenantUsed!: TenantUsedDTO;
  userTime?: TDSSafeAny;

  constructor(
    private tenantService: TenantService,
    private message: TDSMessageService
  ) {}

  ngOnInit(): void {
    this.loadInfo();
    this.options = this.chartOptions.BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }

  loadInfo() {
    this.isLoading = true;
    this.tenantService.getInfo()
      .subscribe(res => {
        this.tenantInfo = res;
        this.loadUsed();
        this.updateUserTime(res?.Tenant?.DateExpired);
      }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  loadUsed() {
    this.tenantService.getUsed()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.tenantUsed = res;
        this.uploadChart(res);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  uploadChart(used: TenantUsedDTO) {
    this.chartComponent.series[0].data[0] = used.fastSaleOrder;
    this.chartComponent.series[0].data[1] = this.tenantInfo.Limitations.FastSaleOrder;
    this.options = this.chartOptions.BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }

  updateUserTime(dateExpired: TDSSafeAny) {
    if(dateExpired) {
      let timer = DateHelperV2.getCountDownTimer(dateExpired);
      let value = timer.days + " ngày " + timer.hours + " giờ " + timer.minutes + " phút ";
      this.userTime = value;
    }
  }
}
