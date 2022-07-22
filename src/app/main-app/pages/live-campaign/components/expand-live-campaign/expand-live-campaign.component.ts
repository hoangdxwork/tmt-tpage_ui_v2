import { finalize } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TdsSwitchChange } from 'tds-ui/switch';
import { Subject, takeUntil } from 'rxjs';
import { GetAllFacebookPostDTO } from 'src/app/main-app/dto/live-campaign/getall-facebook-post.dto';
import { ODataLiveCampaignDetailDTO } from 'src/app/main-app/dto/live-campaign/odata-livecampaign-detail.dto';

@Component({
  selector: 'expand-live-campaign',
  templateUrl: './expand-live-campaign.component.html'
})

export class ExpandLiveCampaignComponent implements OnInit, OnDestroy {

  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  liveCampaigns!: ODataLiveCampaignDetailDTO;
  facebookPosts!: GetAllFacebookPostDTO[];

  private destroy$ = new Subject<void>();

  constructor(private message: TDSMessageService,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
