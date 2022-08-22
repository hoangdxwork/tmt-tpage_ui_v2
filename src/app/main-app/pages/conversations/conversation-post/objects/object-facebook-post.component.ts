import { PrepareFacebookPostHandler } from './../../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ObjectFacebookPostEvent } from './../../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignPostComponent } from './../live-campaign-post/live-campaign-post.component';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniLiveCampaignDto, ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'object-facebook-post',
  templateUrl: './object-facebook-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectFacebookPostComponent  implements OnInit, OnChanges {

  @Input() item!: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];
  @Input() lstOfLiveCampaign!: LiveCampaignModel[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  mdbFbPost!: MDB_Facebook_Mapping_PostDto;
  currentLiveCampaign?: ChatomniLiveCampaignDto;
  indClickTag: string = '';

  constructor(private liveCampaignService: LiveCampaignService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private objectEvent: ObjectFacebookPostEvent,
    private fbPostHandler: FaceBookPostItemHandler,
    private prepareHandler: PrepareFacebookPostHandler,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["item"] && !changes["item"].firstChange) {
        this.item = {...changes["item"].currentValue};
        this.loadData();
    }

    if(changes['lstOfLiveCampaign'] && !changes['lstOfLiveCampaign'].firstChange) {
        this.lstOfLiveCampaign = [...changes['lstOfLiveCampaign'].currentValue];
    }
  }

  loadData(){
    if(this.item) {
      this.mdbFbPost = this.item.Data as MDB_Facebook_Mapping_PostDto;
      if(this.item.LiveCampaignId && this.item.LiveCampaign) {
          this.currentLiveCampaign = {...this.item.LiveCampaign};
      }
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
        lstOfData: this.lstOfLiveCampaign
      }
    });

    modal.afterClose?.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniObjectsItemDto) => {
      if(res){
          this.currentLiveCampaign = {
              Id: res.LiveCampaignId,
              Name: res.LiveCampaign?.Name,
              Note: res.LiveCampaign?.Note
          };
      }
      this.objectEvent.changeLiveCampaignFromObject$.emit(this.item);
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
    if(!this.item.LiveCampaign && this.currentLiveCampaign) {
        this.currentLiveCampaign = null as any;
    }
  }

  insertLiveCampaign() {debugger
    if(this.currentLiveCampaign){

      let id = this.currentLiveCampaign.Id;
      let data = this.item;

      this.liveCampaignService.updateLiveCampaignPost(id, data).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              if(res && res.value) {
                  
                  this.item.LiveCampaign = {...this.currentLiveCampaign} as any;
                  this.item.LiveCampaignId = this.currentLiveCampaign?.Id;

                  this.message.success('Cập nhật chiến dịch thành công');
                  this.objectEvent.changeLiveCampaignFromObject$.emit(this.item);
                  this.cdRef.markForCheck();
              }
          },
          error: (err: any) => {
              this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
          }
      })

      this.indClickTag = '';
    }
  }
}
