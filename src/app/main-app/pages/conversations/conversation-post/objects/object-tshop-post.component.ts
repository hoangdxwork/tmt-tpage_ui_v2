import { FacebookLiveCampaignPostComponent } from './../facebook-livecampaign-post/facebook-livecampaign-post.component';
import { OverviewLiveCampaignComponent } from './../../../../shared/overview-live-campaign/overview-live-campaign.component';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ListLiveCampaignComponent } from 'src/app/main-app/shared/list-live-campaign/list-live-campaign.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';

@Component({
  selector: 'object-tshop-post',
  templateUrl: './object-tshop-post.component.html',
  styleUrls : ['./object-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectTshopPostComponent  implements OnInit {

  @Input() item!: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  mdbTshopPost!: ChatomniDataTShopPostDto;
  currentLiveCampaign!: any;
  indClickTag: string = '';
  postPictureError: any[] = [];

  constructor(private modal: TDSModalService,
    private crmTeamService: CRMTeamService,
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
            type: CRMTeamType._TShop
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
            type: CRMTeamType._TShop
        }
      })
    }
  }
}
