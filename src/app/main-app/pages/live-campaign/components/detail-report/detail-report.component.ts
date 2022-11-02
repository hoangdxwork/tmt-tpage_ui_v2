import { TDSSafeAny } from 'tds-ui/shared/utility';
import { LiveCampaignDTO } from './../../../../dto/live-campaign/odata-live-campaign.dto';
import { ElementRef, AfterViewInit } from '@angular/core';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { OverviewReportDTO } from '@app/dto/live-campaign/report-livecampain-overview.dto';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class DetailReportComponent implements OnInit, AfterViewInit {

  @ViewChild('viewCollapse') viewCollapse!: ElementRef;
  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  dataLiveCampaign!: LiveCampaignDTO;
  dataOverviewReport!: OverviewReportDTO;
  height!: number;
  padding: number = 32;
  gridItems: number = 184;

  constructor(private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private resizeObserver: TDSResizeObserver,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadOverviewReport(this.liveCampaignId);
    this.loadLiveCampaign(this.liveCampaignId);
  }

  ngAfterViewInit(): void {

    this.resizeObserver.observe(this.viewCollapse).subscribe(() => {
        this.height = this.viewCollapse.nativeElement.offsetHeight - this.padding - this.gridItems - 170;
        this.cdr.detectChanges();
      });
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.dataLiveCampaign = res;

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
        }
      });
  }

  loadOverviewReport (id: string) {
    this.isLoading = true;
    this.liveCampaignService.overviewReport(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.dataOverviewReport = res;

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
        }
      });
  }
}
