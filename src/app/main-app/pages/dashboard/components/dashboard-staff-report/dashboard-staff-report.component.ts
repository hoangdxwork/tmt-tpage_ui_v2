import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { finalize, takeUntil } from 'rxjs/operators';
import { Color } from 'echarts';
import { TDSPieChartComponent, TDSChartOptions, TruncateString } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { SummaryActivityByStaffDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';

@Component({
  selector: 'app-dashboard-staff-report',
  templateUrl: './dashboard-staff-report.component.html',
  providers: [TDSDestroyService]
})

export class DashboardStaffReportComponent implements OnInit {

  staffOption:TDSSafeAny;
  chartOption = TDSChartOptions();

  colors:Color[] = [];
  staffsData:TDSSafeAny[] = [];
  emptyData = false;
  totalCountReport = 0;
  
  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  isLoading: boolean = false;
  lstSummaryActivityByStaff: SummaryActivityByStaffDTO[] = [];

  constructor(private reportFacebookService: ReportFacebookService,
    private commonHandler: CommonHandler,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
      this.tdsDateRanges = this.commonHandler.tdsDateRanges;
      this.currentDateRanges = this.commonHandler.currentDateRanges;
  }

  ngOnInit(): void {
    this.loadOverviewEmploy();
  }

  loadOverviewEmploy() {
    let startDate = this.currentDateRanges.startDate.toISOString();
    let endDate = this.currentDateRanges.endDate.toISOString();

    this.isLoading = true;
    this.reportFacebookService.getSummaryByStaffs(startDate, endDate).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          if(TDSHelperArray.hasListValue(res)){
            
            this.emptyData = false;
            this.lstSummaryActivityByStaff = [...res];
            this.lstSummaryActivityByStaff.sort((pre: any, cur: any)=> (pre.TotalCount > cur.TotalCount ? -1 : 1));

            this.loadDataChart(this.lstSummaryActivityByStaff);
          } else {
            this.emptyData = true;
          }

          this.isLoading = false;
        }, 
        error:(err) => {
          this.emptyData = true;
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
      });
  }

  loadDataChart(data: SummaryActivityByStaffDTO[]){
    this.staffsData = [];
    this.lstSummaryActivityByStaff.forEach(x => this.totalCountReport += x.TotalCount);

    this.staffsData = data.map(x => {
      return {
        id: x.StaffId,
        name: x.StaffName,
        value: x.TotalCount,
        percent: x.TotalCount/this.totalCountReport
      }
    });

    this.colors= ['#28A745','#FF8900','#2684FF'];

    if(this.staffsData.length == 0){
      this.emptyData = true;
    }

    let chart:TDSPieChartComponent = {
      color: this.colors,
      tooltip: {
        show: true,
        position: 'right',
        borderColor: '#FFF',
        formatter: function(params:TDSSafeAny) {
          return '<span class="text-neutral-1-900 text-body-2 font-semibold font-sans">' + params.name + '</span><br>'
            + '<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tương tác</span><span class="text-neutral-1-900 pl-4 text-body-2 font-semibold font-sans">' + params.value + ' tương tác</span><br>'
            + '<span class="text-neutral-1-900 text-body-2 font-regular font-sans">Tỉ lệ</span><span class="text-neutral-1-900 pl-14 text-body-2 font-semibold font-sans">' + params.percent + '%</span>'
        }
      },
      series: [
        {
          type: 'pie',
          center: ['52%','52%'],
          clockwise: false,
          startAngle: 90,
          width: 260,
          height: 260,
          label: {
            show: true,
            position: 'center',
            padding: [50, 0],
            backgroundColor: '#F2FCF5',
            borderRadius: 999,
            formatter: function (params: TDSSafeAny) {
              return `{highlight|${ params.percent.toFixed(2) }%}\n{header|${ TruncateString(params.name, 10) }}\n{body| ${ TruncateString(params.value, 8) } tương tác}`;
            },
            rich: {
              header: {
                color: '#2C333A',
                fontStyle: 'normal',
                fontSize: 16,
                lineHeight: 24,
                fontWeigth: 600,
                align: 'center',
                fontFamily: 'Segoe UI',
                width: 196
              },
              body: {
                color: '#929DAA',
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 20,
                fontWeigth: 400,
                width: 196,
                align: 'center',
                fontFamily: 'Segoe UI'
              },
              highlight: {
                color: '#28A745',
                fontStyle: 'normal',
                fontSize: 40,
                lineHeight: 53.2 ,
                fontWeigth: 600,
                fontFamily: 'Segoe UI',
                align: 'center',
                width: 196
              }
            }
          },
          emphasis: {
            scale: false
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
          },
          data: this.staffsData
        }
      ]
    }

    this.buildChartDemo(chart);
  }

  buildChartDemo(chart:TDSPieChartComponent){
    this.staffOption = this.chartOption.DonutChartOption(chart, 130, 102);
  }

  onChangeFilter(data:any){
    this.currentDateRanges = data;
    this.totalCountReport = 0;
    this.loadOverviewEmploy();
  }
}
