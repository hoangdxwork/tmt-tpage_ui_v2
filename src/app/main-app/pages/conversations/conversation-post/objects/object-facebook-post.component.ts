import { PrepareFacebookPostHandler } from './../../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ObjectFacebookPostEvent } from './../../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignPostComponent } from './../live-campaign-post/live-campaign-post.component';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'object-facebook-post',
  templateUrl: './object-facebook-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectFacebookPostComponent  implements OnInit {

  @Input() item!: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];
  @Input() availableCampaigns!: LiveCampaignModel[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  mdbFbPost!: MDB_Facebook_Mapping_PostDto;
  currentLiveCampaign?: LiveCampaignModel;
  indClickTag: string = '';

  constructor(private liveCampaignService: LiveCampaignService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private objectEvent: ObjectFacebookPostEvent,
    private fbPostHandler: FaceBookPostItemHandler,
    private prepareHandler: PrepareFacebookPostHandler,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(this.item) {
      this.mdbFbPost = this.item.Data as MDB_Facebook_Mapping_PostDto;
      this.currentLiveCampaign = this.availableCampaigns.find(f=> f.Id == this.item?.LiveCampaignId);
    }
  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto) {
    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        post: data,
        currentLiveCampaign: this.currentLiveCampaign,
        lstOfData: this.availableCampaigns
      }
    });

    modal.componentInstance?.getCurrentLiveCampaign$.subscribe(res => {
      this.currentLiveCampaign = res;

      if(this.item?.Data){
        this.item = this.fbPostHandler.updateLiveCampaignPost(this.item, res);
      }

      this.objectEvent.getObjectFBData$.emit(this.item);

      this.cdr.detectChanges();
    })
  }

  selectPost(item: ChatomniObjectsItemDto) {
    this.selectPostItemEvent.emit(item);
  }

  openTag(id: string) {
    this.indClickTag = id;
  }

  closeTag(): void {
    this.indClickTag = '';
  }

  addNewCampaign() {
    if(this.currentLiveCampaign){
      let data =  this.prepareHandler.prepareModel((<MDB_Facebook_Mapping_PostDto> this.item?.Data), this.currentLiveCampaign);
      let liveCampaignId = this.currentLiveCampaign?.Id || this.item?.LiveCampaignId;
      
      this.liveCampaignService.updateLiveCampaignPost(liveCampaignId, data).pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if(res.value){
            this.fbPostHandler.updateLiveCampaignPost(this.item, this.currentLiveCampaign);
            this.objectEvent.getObjectFBData$.emit(this.item);
            this.message.success('Cập nhật chiến dịch thành công');

            this.cdr.markForCheck();
          }
        },
        err=>{
          this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
        })

      this.indClickTag = '';
    }
  }
}