import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TdsSwitchChange } from 'tds-ui/switch';
import { Subject, takeUntil } from 'rxjs';
import { GetAllFacebookPostDTO } from 'src/app/main-app/dto/live-campaign/getall-facebook-post.dto';
import { LiveCampaignDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'expand-live-campaign',
  templateUrl: './expand-live-campaign.component.html'
})

export class ExpandLiveCampaignComponent implements OnInit, OnDestroy {

  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  liveCampaigns!: LiveCampaignDTO;
  facebookPosts: GetAllFacebookPostDTO[] = [];
  pageSize = 10;
  pageIndex = 1;

  private destroy$ = new Subject<void>();

  constructor(private message: TDSMessageService,
    private cdrRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private liveCampaignService: LiveCampaignService ) { }

  ngOnInit(): void {
    this.loadLiveCampaign(this.liveCampaignId);
    this.loadFacebookPost(this.liveCampaignId);
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
          if(res) {
              delete res['@odata.context'];
              this.liveCampaigns = { ...res };
          }
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  loadFacebookPost(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getAllFacebookPost(id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
          if(res) {
              this.facebookPosts = [...res];
          }
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      })
  }

  onChangeActive(event: TdsSwitchChange, item: any) {
    if(event) {
      this.isLoading = true;
      this.liveCampaignService.updateActiveDetail(item.Id, event.checked)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {

            item.IsActive = event.checked;
            this.message.success('Thao tác thành công');

        }, error => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        });
    }
  }

  ngAfterViewInit() {
    this.getResizeExpand();
  }

  getResizeExpand() {
    // let element = this.document.getElementById(`expand[${this.liveCampaignId}]`) as any;
    // if(element) {
    //     let containerTable = element.closest('.tds-table-container') as any;
    //     let containerExpand = element.closest('.tds-custom-scroll') as any;
    //     let wrapView = Number(containerTable.clientWidth - 36);
    //     element.setAttribute('style', `width: ${wrapView}px; margin-left: ${Number(containerExpand.scrollLeft) + 2}px;`);

    //     let scrollTable = element.closest('.tds-custom-scroll');
    //     if(element && scrollTable) {
    //       scrollTable.addEventListener('scroll', function() {
    //           let scrollleft = Number(scrollTable.scrollLeft);
    //           let wrapScroll = Number(scrollTable.clientWidth - 24);

    //           element.setAttribute('style', `margin-left: ${scrollleft}px; width: ${wrapScroll}px;`)
    //       });
    //     }
    // }

    // this.cdrRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
