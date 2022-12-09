import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ListLiveCampaignComponent } from 'src/app/main-app/shared/list-live-campaign/list-live-campaign.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';

@Component({
  selector: 'object-tiktok-post',
  templateUrl: './object-tiktok-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectTiktokPostComponent  implements OnInit {

  @Input() item?: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

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

}
