import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { OverviewLiveCampaignComponent } from '@app/shared/overview-live-campaign/overview-live-campaign.component';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { FacebookLiveCampaignPostComponent } from '../facebook-livecampaign-post/facebook-livecampaign-post.component';

@Component({
  selector: 'object-tiktok-post',
  templateUrl: './object-tiktok-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectTiktokPostComponent  implements OnInit {

  @Input() item!: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() extrasChilds!: any[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  indClickTag: string = '';
  currentLiveCampaign!: any;
  postPictureError: any[] = [];

  constructor(private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }

  selectPost(item: ChatomniObjectsItemDto) {
    this.selectPostItemEvent.emit(item);
  }

  errorPostPicture(item: ChatomniObjectsItemDto) {
    this.postPictureError.push(item?.ObjectId);
  }

  checkPostPictureError(item: ChatomniObjectsItemDto) {
    return this.postPictureError.find(f => f == item?.ObjectId);
  }

  openTag(item: any) {
    this.indClickTag = item.Id;
    this.showModalLiveCampaign(this.item);
  }

  closeTag(): void {
    this.indClickTag = '';
    if(!this.item.LiveCampaign && this.currentLiveCampaign) {
        this.currentLiveCampaign = null as any;
        this.item.LiveCampaignId = null as any;
        this.item.LiveCampaign = null as any;
    }
  }

  showModalLiveCampaign(data?: ChatomniObjectsItemDto) {
    if(data?.LiveCampaign?.Id) {
      const modal = this.modal.create({
        title: 'Tổng quan chiến dịch live',
        content: OverviewLiveCampaignComponent,
        size: "xl",
        bodyStyle: {
          padding: '0px'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            liveCampaignId: data?.LiveCampaign?.Id,
            data: data,
            type: CRMTeamType._UnofficialTikTok
        }
      });
    } else {
      const modal = this.modal.create({
        title: 'Chiến dịch',
        content: FacebookLiveCampaignPostComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: data,
            type: CRMTeamType._UnofficialTikTok
        }
      })
    }
  }

}
