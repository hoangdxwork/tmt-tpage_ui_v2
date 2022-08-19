import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ListLiveCampaignComponent } from 'src/app/main-app/shared/list-live-campaign/list-live-campaign.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto} from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';

@Component({
  selector: 'object-tshop-post',
  templateUrl: './object-tshop-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectTshopPostComponent  implements OnInit, OnChanges {

  @Input() item?: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();
  // ChatomniDataTShopPostDto
  mdbTshopPost!: ChatomniDataTShopPostDto;

  constructor(private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    if(this.item) {
        this.mdbTshopPost = this.item.Data as ChatomniDataTShopPostDto;
    }
  }

  showModalLiveCampaign(item: ChatomniObjectsItemDto) {
    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: ListLiveCampaignComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        post: item
      }
    });
  }

  selectPost(item: ChatomniObjectsItemDto) {
      this.selectPostItemEvent.emit(item);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
