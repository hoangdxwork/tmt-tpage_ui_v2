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

  @Input() item?: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();
  mdbTshopPost!: ChatomniDataTShopPostDto;

  fallbackImg = "../../../assets/imagesv2/errorPic.svg";

  constructor(private modal: TDSModalService,
    private crmTeamService: CRMTeamService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }

  selectPost(item: ChatomniObjectsItemDto) {
      this.selectPostItemEvent.emit(item);
  }

}
