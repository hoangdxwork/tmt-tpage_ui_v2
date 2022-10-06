import { ElementRef, AfterViewInit } from '@angular/core';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';

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
  data!: any;
  dataLiveCampaign!: any;
  height!: number;
  padding: number = 32;
  gridItems: number = 184;

  constructor(private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private resizeObserver: TDSResizeObserver,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadReportLiveCampaign(this.liveCampaignId);
    this.loadLiveCampaign(this.liveCampaignId);
  }

  ngAfterViewInit(): void {

    this.resizeObserver.observe(this.viewCollapse).subscribe(() => {
        this.height = this.viewCollapse.nativeElement.offsetHeight - this.padding - this.gridItems - 170;
        this.cdr.detectChanges();
      });
  }

  loadReportLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getReport(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.data = {...res};
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
        }
      })
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
}
